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
import { truncateText, reportToAdmin, cleanMarkdown } from './utils';
import { MAX_TOKENS } from '../../shared/constants';
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
> = async (
  {
    exerciseId,
    priorKnowledge,
    length,
    level,
    model,
    includeSummary,
    includeMCQuiz,
  },
  context
) => {
  // 1. Ensure user is logged in and has at least 1 credit
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  if (context.user.credits < 1) {
    return {
      success: false,
      message: 'Not enough credits. You need at least 1 credit to generate an exercise.',
    };
  }

  // 2. Ensure the exercise exists
  const exercise = await context.entities.Exercise.findUnique({
    where: { id: exerciseId },
  });
  if (!exercise) {
    return { success: false, message: 'Exercise not found' };
  }

  // 3. Download the raw content from S3
  let exerciseContentUrl;
  try {
    exerciseContentUrl = await getS3DownloadUrl({ key: exerciseId + '.txt' });
  } catch (error) {
    console.error('Error getting S3 download URL:', error);
    return { success: false, message: 'Failed to retrieve exercise content URL' };
  }

  const response = await fetch(exerciseContentUrl);
  if (!response.ok) {
    return { success: false, message: 'Failed to download exercise content' };
  }

  // 4. Possibly truncate if too long
  const exerciseText = await response.text();
  const { text: filtered_content, truncated } = truncateText(exerciseText);

  // 5. Generate main exercise content
  let exerciseJson: any;
  try {
    // Ensure priorKnowledge is an array
    const priorKnowledgeArray = Array.isArray(priorKnowledge)
      ? priorKnowledge
      : typeof priorKnowledge === 'string'
      ? [priorKnowledge]
      : [];

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

  // 6. Generate complexity tags if you want
  let complexityJson: any;
  try {
    const complexityResponse = await OpenAIService.generateComplexity(
      lectureContent,
      model,
      MAX_TOKENS,
    );
    if (complexityResponse.success && complexityResponse.data?.taggedText) {
      complexityJson = complexityResponse.data;
      exerciseJson.taggedText = complexityJson.taggedText;
      // Update status to EXERCISE_TAGGED
      await context.entities.Exercise.update({
        where: { id: exerciseId },
        data: { status: 'EXERCISE_TAGGED' },
      });
    }
  } catch (error) {
    console.error('Failed to generate complexity tags:', error);
    await reportToAdmin(`Failed to generate complexity tags: ${error}`);
  }

  // 7. Optionally generate audio (if you have this service)
  const documentParserUrl = process.env.DOCUMENT_PARSER_URL;
  if (documentParserUrl) {
    // Generate audio
    const formData = new FormData();
    formData.append('exerciseId', exerciseId);
    formData.append('generate_text', exerciseJson.taggedText || lectureContent);

    const audioResponse = await fetch(`${documentParserUrl}/generate-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!audioResponse.ok) {
      const errorData = await audioResponse.json();
      console.error('Failed to generate audio:', errorData);
      const errorMessage = (errorData as { message?: string }).message || 'Unknown error';
      await reportToAdmin(`Failed to generate audio: ${errorMessage}`);
    }
  }

  let summaryJson = null;
  if (includeSummary) {
    try {
      const summaryResponse = await OpenAIService.generateSummary(
        lectureContent,
        model,
        MAX_TOKENS
      );
      if (summaryResponse.success && summaryResponse.data) {
        summaryJson = summaryResponse.data;

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
  if (includeMCQuiz) {
    try {
      const questionsResponse = await OpenAIService.generateQuestions(lectureContent, model, MAX_TOKENS);
      if (questionsResponse.success && questionsResponse.data) {
        questions = questionsResponse.data.questions;

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
  // 10. Update the exercise record
  try {
    await context.entities.Exercise.update({
      where: { id: exerciseId },
      data: {
        lessonText: exerciseJson.taggedText || '',
        paragraphSummary: summaryJson?.paragraphSummary || '',
        level,
        truncated,
        tokens: (exerciseJson?.tokens || 0) + (summaryJson?.tokens || 0) + (questions?.tokens || 0) + (complexityJson?.tokens || 0),
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

  // 11. Create MC Questions if generated
  if (questions && Array.isArray(questions)) {
    try {
      await Promise.all(
        questions.map(
          async (question: { text: string; options: Array<{ text: string; isCorrect: boolean }> }) => {
            await context.entities.Question.create({
              data: {
                text: question.text,
                exercise: { connect: { id: exerciseId } },
                options: {
                  create: question.options.map((opt) => ({
                    text: opt.text,
                    isCorrect: opt.isCorrect,
                  })),
                },
              },
            });
          }
        )
      );
    } catch (error: any) {
      await reportToAdmin(`Failed to create questions: ${error.message}`);
      console.error('Database Error:', error);
    }
  }

  // 12. Deduct exactly 1 credit from the user
  try {
    await context.entities.User.update({
      where: { id: context.user.id },
      data: { credits: { decrement: 1 } },
    });
  } catch (err) {
    await reportToAdmin(`Failed to deduct 1 credit from user: ${String(err)}`);
    console.error('Credit deduction error:', err);
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
