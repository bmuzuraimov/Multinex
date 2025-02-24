import {
  type CreateExercise,
  type ShareExercise,
  type UpdateExercise,
  type DeleteExercise,
  type GenerateExercise,
} from 'wasp/server/operations';
import { HttpError } from 'wasp/server';
import { Exercise } from 'wasp/entities';
import { getS3DownloadUrl } from '../utils/s3Utils';
import { OpenAIService } from '../llm/openai';
import { TokenService } from '../llm/tokenService';
import { truncateText, reportToAdmin, cleanMarkdown } from './utils';
import { MAX_TOKENS, OPENAI_MODEL } from '../../shared/constants';
import { TiktokenModel } from 'tiktoken';
import { deleteS3Objects } from '../utils/s3Utils';

// Create empty exercise
export const createExercise: CreateExercise<{ name: string, topicId: string | null }, Exercise> = async ({ name, topicId }, context) => {
  try {
    return await context.entities.Exercise.create({
      data: {
        name,
        user: context.user ? { connect: { id: context.user.id } } : undefined,
        lessonText: '',
        paragraphSummary: '',
        level: '',
        truncated: false,
        tokens: 0,
        model: '',
        no_words: 0,
        topic: topicId ? { connect: { id: topicId } } : undefined,
      },
    });
  } catch (error: any) {
    await reportToAdmin(`Failed to create exercise: ${error.message}`);
    console.error('Database Error:', error);
    throw new HttpError(500, 'Failed to create exercise. Please try again later.');
  }
};

export const generateExercise: GenerateExercise<
  {
    exerciseId: string;
    priorKnowledge: string[];
    length: string;
    level: string;
    model: string;
    includeSummary: boolean;
    includeMCQuiz: boolean;
  },
  { success: boolean; message: string }
> = async ({ exerciseId, priorKnowledge, length, level, model, includeSummary, includeMCQuiz }, context) => {
  // Ensure the exercise exists
  const exercise = await context.entities.Exercise.findUnique({
    where: { id: exerciseId },
  });
  if (!exercise) {
    return { success: false, message: 'Exercise not found' };
  }
  // Get the signed URL for the S3 file
  let exerciseContentUrl = await getS3DownloadUrl({ key: exerciseId + '.txt' });

  // Fetch the content using fetch API since readFile doesn't work with URLs
  const response = await fetch(exerciseContentUrl);
  if (!response.ok) {
    return { success: false, message: 'Failed to download exercise content' };
  }
  let exerciseText = await response.text();
  const { text: filtered_content, truncated } = truncateText(exerciseText);

  // Calculate required tokens
  const required_tokens = TokenService.calculateRequiredTokens(filtered_content, OPENAI_MODEL as TiktokenModel);

  // Check if the user has enough tokens only if there is a user context
  if (context.user) {
    if (context.user.tokens < required_tokens) {
      return {
        success: false,
        message: `The request requires approximately ${required_tokens} tokens, but you only have ${context.user.tokens} tokens. Please purchase more tokens.`,
      };
    }
  }

  let exerciseJson: any;
  let exerciseJsonUsage = 0;
  try {
    const exerciseResponse = await OpenAIService.generateExercise(
      filtered_content,
      priorKnowledge.join(','),
      length,
      level,
      model,
      MAX_TOKENS
    );
    if (!exerciseResponse.success || !exerciseResponse.data) {
      return { success: false, message: 'Error generating exercise content.' };
    }
    exerciseJson = exerciseResponse.data;
    exerciseJsonUsage = exerciseResponse.usage || 0;

    // Update status to EXERCISE_GENERATED
    await context.entities.Exercise.update({
      where: { id: exerciseId },
      data: { status: 'EXERCISE_GENERATED' },
    });
  } catch (error) {
    console.error('Failed to generate exercise after multiple attempts:', error);
    return { success: false, message: 'Failed to generate exercise after multiple attempts.' };
  }

  const lectureContent = cleanMarkdown(exerciseJson.lectureContent);

  const complexityJson = await OpenAIService.generateComplexity(lectureContent, model, MAX_TOKENS);

  if (complexityJson.success && complexityJson.data.taggedText) {
    exerciseJson.taggedText = complexityJson.data.taggedText;

    // Update status to EXERCISE_TAGGED
    await context.entities.Exercise.update({
      where: { id: exerciseId },
      data: { status: 'EXERCISE_TAGGED' },
    });
  }

  const documentParserUrl = process.env.DOCUMENT_PARSER_URL;
  if (documentParserUrl) {
    // Generate audio
    const formData = new FormData();
    formData.append('exerciseId', exerciseId);
    formData.append('generate_text', exerciseJson.taggedText);
    const audioResponse = await fetch(`${documentParserUrl}/generate-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!audioResponse.ok) {
      await reportToAdmin('Failed to generate audio.');
    }
  }

  let summaryJson = null;
  let summaryJsonUsage = 0;
  if (includeSummary) {
    try {
      const summaryResponse = await OpenAIService.generateSummary(lectureContent, model, MAX_TOKENS);
      if (summaryResponse.success && summaryResponse.data) {
        summaryJson = summaryResponse.data;
        summaryJsonUsage = summaryResponse.usage || 0;

        // Update status to SUMMARY_GENERATED
        await context.entities.Exercise.update({
          where: { id: exerciseId },
          data: { status: 'SUMMARY_GENERATED' },
        });
      } else {
        await reportToAdmin('Failed to generate summary.');
      }
    } catch (error) {
      console.error('Failed to generate summary after multiple attempts:', error);
      await reportToAdmin('Failed to generate summary after multiple attempts.');
    }
  }

  let questions = null;
  let questionsUsage = 0;
  let questionsSuccess = false;
  if (includeMCQuiz) {
    try {
      const questionsResponse = await OpenAIService.generateQuestions(lectureContent, model, MAX_TOKENS);
      if (questionsResponse.success && questionsResponse.data) {
        questions = questionsResponse.data.questions;
        questionsUsage = questionsResponse.usage || 0;
        questionsSuccess = true;

        // Update status to QUESTIONS_GENERATED
        await context.entities.Exercise.update({
          where: { id: exerciseId },
          data: { status: 'QUESTIONS_GENERATED' },
        });
      } else {
        await reportToAdmin('Failed to generate questions.');
      }
    } catch (error) {
      console.error('Failed to generate questions after multiple attempts:', error);
      await reportToAdmin('Failed to generate questions after multiple attempts.');
    }
  }

  // Aggregate token usage
  const totalTokensUsed = exerciseJsonUsage + summaryJsonUsage + questionsUsage;

  try {
    await context.entities.Exercise.update({
      where: { id: exerciseId },
      data: {
        lessonText: exerciseJson.taggedText || '',
        paragraphSummary: summaryJson?.paragraphSummary || '',
        level,
        truncated,
        tokens: totalTokensUsed,
        model,
        no_words: lectureContent.split(' ').length || parseInt(length, 10),
        status: 'FINISHED',
      },
    });
  } catch (error: any) {
    await reportToAdmin(`Failed to update exercise in the database: ${error.message}`);
    console.error('Database Error:', error);
    return { success: false, message: 'Failed to update exercise. Please try again later.' };
  }

  // Create questions if generated successfully
  if (includeMCQuiz && questionsSuccess && questions) {
    try {
      await Promise.all(
        questions.map(async (question: { text: string; options: { text: string; isCorrect: boolean }[] }) => {
          await context.entities.Question.create({
            data: {
              text: question.text,
              exercise: { connect: { id: exerciseId } },
              options: {
                create: question.options.map((option) => ({
                  text: option.text,
                  isCorrect: option.isCorrect,
                })),
              },
            },
          });
        })
      );
    } catch (error: any) {
      await reportToAdmin(`Failed to create questions: ${error.message}`);
      console.error('Database Error:', error);
    }
  }

  // Deduct tokens from the user's account only if there is a user context
  if (context.user) {
    try {
      await TokenService.deductTokens(context, totalTokensUsed);
    } catch (error: any) {
      await reportToAdmin(`Failed to deduct tokens: ${error.message}`);
      console.error('Token Deduction Error:', error);
    }
  }

  return { success: true, message: 'Exercise updated successfully' };
};

export const shareExercise: ShareExercise<{ exerciseId: string; emails: Array<string> }, string> = async (
  { exerciseId, emails },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const exercise = await context.entities.Exercise.findUnique({
    where: { id: exerciseId },
  });

  if (!exercise) {
    throw new HttpError(404, 'Exercise not found');
  }

  try {
    await Promise.all(
      emails.map(async (email) => {
        await context.entities.Exercise.create({
          data: {
            name: exercise.name,
            lessonText: exercise.lessonText,
            paragraphSummary: exercise.paragraphSummary,
            level: exercise.level,
            truncated: exercise.truncated,
            tokens: exercise.tokens,
            model: exercise.model,
            no_words: exercise.no_words,
            user: { connect: { email } },
            topic: exercise.topicId ? { connect: { id: exercise.topicId } } : undefined,
          },
        });
      })
    );
    return 'Exercise shared successfully';
  } catch (error: any) {
    await reportToAdmin(`Failed to share exercise: ${error.message}`);
    console.error('Share Exercise Error:', error);
    throw new HttpError(500, 'Failed to share exercise. Please try again later.');
  }
};

export const updateExercise: UpdateExercise<{ id: string; updated_data: Partial<Exercise> }, Exercise> = async (
  { id, updated_data },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (updated_data.lessonText && updated_data.lessonText.length > 0) {
    updated_data.no_words = updated_data.lessonText.split(' ').length;
    updated_data.paragraphSummary = '';
  }

  // Ensure cursor updates are included in database updates
  if (updated_data.cursor !== undefined) {
    updated_data.cursor = Math.max(0, updated_data.cursor); // Prevent negative values
  }

  const updatedExercise = await context.entities.Exercise.update({
    where: { id },
    data: updated_data,
  });

  return updatedExercise;
};

export const deleteExercise: DeleteExercise<{ id: string }, Exercise> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  await deleteS3Objects({ key: id });

  return context.entities.Exercise.delete({
    where: {
      id,
      userId: context.user.id,
    },
  });
};
