import {
  type CreateExercise,
  type ShareExercise,
  type UpdateExercise,
  type DeleteExercise,
  type GenerateExercise,
} from 'wasp/server/operations';
import { HttpError } from 'wasp/server';
import { Exercise } from 'wasp/entities';
import { getS3DownloadUrl, deleteS3Objects } from '../utils/s3Utils';
import { OpenAIService } from '../llm/models/openai';
import { truncateText, reportToAdmin, cleanMarkdown } from './utils';
import { MAX_TOKENS } from '../../shared/constants';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { ExerciseStatus } from '@prisma/client';
import { DEFAULT_PRE_PROMPT, DEFAULT_POST_PROMPT } from '../../shared/constants';
export const createExercise: CreateExercise<{ name: string; topicId: string | null }, Exercise> = async (
  { name, topicId },
  context
) => {
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
    sensoryModes: ('listen' | 'type' | 'write')[];
  },
  { success: boolean; message: string }
> = async (
  { exerciseId, priorKnowledge, length, level, model, includeSummary, includeMCQuiz, sensoryModes },
  context
) => {
  // Ensure the exercise exists
  const exercise = await context.entities.Exercise.findUnique({
    where: { id: exerciseId },
  });
  if (!exercise) {
    return { success: false, message: 'Exercise not found' };
  }

  // 2. Download the raw content from S3
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

  // 3. Possibly truncate if too long
  const rawExerciseText = await response.text();
  const { text: truncatedExerciseText, truncated } = truncateText(rawExerciseText);

  // Check if the user has enough tokens only if there is a user context
  if (context.user && context.user.credits < 1) {
    return {
      success: false,
      message: "You don't have enough credits. Please top up your credits to continue.",
    };
  }

  let generatedExerciseText: string;
  let generatedExerciseTokens: number;
  let taggedExerciseText: string;
  try {
    // Ensure priorKnowledge is an array
    const priorKnowledgeArray = Array.isArray(priorKnowledge)
      ? priorKnowledge
      : typeof priorKnowledge === 'string'
        ? [priorKnowledge]
        : []; // Default to empty array if not a string or array
    const exercisePrompt = context.user
      ? await context.entities.ExerciseGeneratePrompt.findFirst({
          where: { userId: context.user.id },
        })
      : null;
    const exerciseResponse = await OpenAIService.generateExercise(
      truncatedExerciseText,
      priorKnowledgeArray.join(','),
      length,
      level,
      model,
      MAX_TOKENS,
      exercisePrompt?.pre_prompt || DEFAULT_PRE_PROMPT,
      exercisePrompt?.post_prompt || DEFAULT_POST_PROMPT
    );

    if (!exerciseResponse.success || !exerciseResponse.data) {
      return { success: false, message: `Error generating exercise content: ${exerciseResponse.message}` };
    }
    generatedExerciseText = exerciseResponse.data;
    generatedExerciseTokens = exerciseResponse.usage || 0;

    // Mark status
    await context.entities.Exercise.update({
      where: { id: exerciseId },
      data: { status: ExerciseStatus.EXERCISE_GENERATED },
    });
  } catch (error) {
    console.error('Failed to generate exercise:', error);
    return { success: false, message: 'Failed to generate exercise.' };
  }

  // Clean the main lecture content
  const lectureContent = cleanMarkdown(generatedExerciseText);

  // 6. Generate complexity tags (where we REALLY use sensoryModes)
  let complexityJson: any;
  let complexityUsage = 0;
  try {
    const complexityResponse = await OpenAIService.generateComplexity(lectureContent, model, MAX_TOKENS, sensoryModes);
    if (complexityResponse.success && complexityResponse.data?.taggedText) {
      complexityJson = complexityResponse.data;
      complexityUsage = complexityResponse.usage || 0;

      // Update status
      await context.entities.Exercise.update({
        where: { id: exerciseId },
        data: { status: ExerciseStatus.EXERCISE_TAGGED },
      });
    }
  } catch (error) {
    console.error('Failed to generate complexity tags:', error);
    // Not necessarily fatal; continue
  }

  taggedExerciseText = complexityJson?.taggedText ? complexityJson.taggedText : '';

  // 7. Optionally generate audio
  const documentParserUrl = process.env.DOCUMENT_PARSER_URL;
  if (documentParserUrl) {
    try {
      const formData = new FormData();
      formData.append('exerciseId', exerciseId);
      formData.append('generate_text', taggedExerciseText || '');
      const audioResponse = await fetch(`${documentParserUrl}/generate-audio`, {
        method: 'POST',
        body: formData,
      });
      if (!audioResponse.ok) {
        await reportToAdmin('Failed to generate audio (non-200 response).');
      }
    } catch (err) {
      await reportToAdmin(`Failed to generate audio: ${String(err)}`);
      console.error('Audio generation error:', err);
    }
  }

  // 8. Optionally generate summary
  let summaryJson = null;
  if (includeSummary) {
    try {
      const summaryResponse = await OpenAIService.generateSummary(lectureContent, model, MAX_TOKENS);
      if (summaryResponse.success && summaryResponse.data) {
        summaryJson = summaryResponse.data;

        // Mark status
        await context.entities.Exercise.update({
          where: { id: exerciseId },
          data: { status: ExerciseStatus.SUMMARY_GENERATED },
        });
      } else {
        await reportToAdmin('Failed to generate summary (no success).');
      }
    } catch (err) {
      console.error('Failed to generate summary:', err);
      await reportToAdmin('Failed to generate summary after multiple attempts.');
    }
  }

  // 9. Optionally generate MC Quiz
  let questions = null;
  if (includeMCQuiz) {
    try {
      const questionsResponse = await OpenAIService.generateQuestions(lectureContent, model, MAX_TOKENS);
      if (questionsResponse.success && questionsResponse.data) {
        questions = questionsResponse.data.questions;

        // Mark status
        await context.entities.Exercise.update({
          where: { id: exerciseId },
          data: { status: ExerciseStatus.QUESTIONS_GENERATED },
        });
      } else {
        await reportToAdmin('Failed to generate questions (no success).');
      }
    } catch (err) {
      console.error('Failed to generate questions:', err);
      await reportToAdmin('Failed to generate questions after multiple attempts.');
    }
  }

  // 10. Update the exercise record
  try {
    await context.entities.Exercise.update({
      where: { id: exerciseId },
      data: {
        lessonText: taggedExerciseText || '',
        paragraphSummary: summaryJson?.paragraphSummary || '',
        level,
        truncated,
        tokens:
          (generatedExerciseTokens || 0) +
          (summaryJson?.tokens || 0) +
          (questions?.tokens || 0) +
          (complexityJson?.tokens || 0),
        model,
        no_words: lectureContent.split(' ').length || parseInt(length, 10),
        status: 'FINISHED',
      },
    });
  } catch (error: any) {
    await reportToAdmin(`Failed to update exercise in DB: ${error.message}`);
    console.error('Database Error updating exercise:', error);
    return { success: false, message: 'Failed to update exercise. Please try again later.' };
  }

  // 12. Create the MC Questions if we generated them
  if (questions && Array.isArray(questions)) {
    try {
      await Promise.all(
        questions.map(async (question: { text: string; options: Array<{ text: string; isCorrect: boolean }> }) => {
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
        })
      );
    } catch (err) {
      await reportToAdmin(`Failed to create MC questions: ${String(err)}`);
      console.error('Error creating questions:', err);
    }
  }

  // 12. Deduct exactly 1 credit from the user if they exist
  if (context.user) {
    try {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: { credits: { decrement: 1 } },
      });
    } catch (err) {
      await reportToAdmin(`Failed to deduct 1 credit from user: ${String(err)}`);
      console.error('Credit deduction error:', err);
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
