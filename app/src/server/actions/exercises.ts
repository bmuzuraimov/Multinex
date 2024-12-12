import { type CreateExercise, type ShareExercise, type UpdateExercise, type DeleteExercise } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';
import { Exercise } from 'wasp/entities';
import { OpenAIService } from '../llm/openai';
import { TokenService } from '../llm/tokenService';
import { truncateText, reportToAdmin, cleanMarkdown } from './utils';
import { MAX_TOKENS, OPENAI_MODEL } from '../../shared/constants';
import { TiktokenModel } from 'tiktoken';



export const createExercise: CreateExercise<
  {
    length: string;
    level: string;
    content: string;
    topicId: string | null;
    model: string;
    includeSummary: boolean;
    includeMCQuiz: boolean;
  },
  { success: boolean; message: string }
> = async ({ length, level, content, topicId, model, includeSummary, includeMCQuiz }, context: any) => {
  // Check for user authentication
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const { text: filtered_content, truncated } = truncateText(content);

  // Calculate required tokens
  const required_tokens = TokenService.calculateRequiredTokens(filtered_content, OPENAI_MODEL as TiktokenModel);

  // Check if the user has enough tokens
  if (context.user.tokens < required_tokens) {
    return {
      success: false,
      message: `The request requires approximately ${required_tokens} tokens, but you only have ${context.user.tokens} tokens. Please purchase more tokens.`,
    };
  }

  let exerciseJson: any;
  let exerciseJsonUsage = 0;
  try {
    const exerciseResponse = await OpenAIService.generateExercise(filtered_content, length, level, model, MAX_TOKENS);
    if (!exerciseResponse.success || !exerciseResponse.data) {
      return { success: false, message: 'Error generating exercise content.' };
    }
    exerciseJson = exerciseResponse.data;
    exerciseJsonUsage = exerciseResponse.usage || 0;
  } catch (error) {
    return { success: false, message: 'Failed to generate exercise after multiple attempts.' };
  }

  const lectureText = cleanMarkdown(exerciseJson.lectureText);

  let summaryJson = null;
  let summaryJsonUsage = 0;
  if (includeSummary) {
    try {
      const summaryResponse = await OpenAIService.generateSummary(lectureText, model, MAX_TOKENS);
      if (summaryResponse.success && summaryResponse.data) {
        summaryJson = summaryResponse.data;
        summaryJsonUsage = summaryResponse.usage || 0;
      } else {
        // Log and continue without summary
        await reportToAdmin('Failed to generate summary.');
      }
    } catch (error) {
      // Log and continue without summary
      await reportToAdmin('Failed to generate summary after multiple attempts.');
    }
  }

  let questions = null;
  let questionsUsage = 0;
  let questionsSuccess = false;
  if (includeMCQuiz) {
    try {
      const questionsResponse = await OpenAIService.generateQuestions(lectureText, model, MAX_TOKENS);
      if (questionsResponse.success && questionsResponse.data) {
        questions = questionsResponse.data.questions;
        questionsUsage = questionsResponse.usage || 0;
        questionsSuccess = true;
      } else {
        // Log and continue without questions
        await reportToAdmin('Failed to generate questions.');
      }
    } catch (error) {
      // Log and continue without questions
      await reportToAdmin('Failed to generate questions after multiple attempts.');
    }
  }

  // Aggregate token usage
  const totalTokensUsed = exerciseJsonUsage + summaryJsonUsage + questionsUsage;

  // Create the exercise
  let newExercise;
  try {
    newExercise = await context.entities.Exercise.create({
      data: {
        name: exerciseJson.name || '',
        prompt: exerciseJson.preExerciseText || '',
        lessonText: lectureText,
        paragraphSummary: summaryJson?.paragraphSummary || '',
        level,
        truncated,
        tokens: totalTokensUsed,
        model,
        no_words: lectureText.split(' ').length || parseInt(length, 10),
        user: { connect: { id: context.user.id } },
        ...(topicId && { topic: { connect: { id: topicId } } }),
      },
    });
  } catch (error: any) {
    await reportToAdmin(`Failed to create exercise in the database: ${error.message}`);
    console.error('Database Error:', error);
    return { success: false, message: 'Failed to create exercise. Please try again later.' };
  }

  // Create questions if generated successfully
  if (includeMCQuiz && questionsSuccess && questions) {
    try {
      await Promise.all(
        questions.map(async (question: { text: string; options: { text: string; isCorrect: boolean }[] }) => {
          await context.entities.Question.create({
            data: {
              text: question.text,
              exercise: { connect: { id: newExercise.id } },
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
      // Optionally, you might want to rollback the exercise creation or notify the user.
    }
  }

  // Deduct tokens from the user's account
  try {
    await TokenService.deductTokens(context, totalTokensUsed);
  } catch (error: any) {
    await reportToAdmin(`Failed to deduct tokens: ${error.message}`);
    console.error('Token Deduction Error:', error);
    // Optionally, you might want to notify the user or revert the exercise creation.
  }

  return { success: true, message: 'Exercise created successfully' };
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
            prompt: exercise.prompt,
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

  return context.entities.Exercise.update({
    where: {
      id,
    },
    data: updated_data,
  });
};

export const deleteExercise: DeleteExercise<{ id: string }, Exercise> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  await context.entities.Option.deleteMany({
    where: {
      question: {
        exerciseId: id,
      },
    },
  });

  await context.entities.Question.deleteMany({
    where: {
      exerciseId: id,
    },
  });

  return context.entities.Exercise.delete({
    where: {
      id,
    },
  });
};
