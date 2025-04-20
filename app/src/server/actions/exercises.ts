import {
  type CreateExercise,
  type ShareExercise,
  type UpdateExercise,
  type DeleteExercise,
  type GenerateExercise,
} from 'wasp/server/operations';
import { Exercise } from 'wasp/entities';
import { getS3DownloadUrl, deleteS3Objects } from '../utils/s3Utils';
import { truncateText, handleError, validateUserAccess } from './utils';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { ExerciseStatus } from '@prisma/client';
import { DEFAULT_PRE_PROMPT, DEFAULT_POST_PROMPT } from '../../shared/constants';
import { LLMFactory } from '../llm/models';
import {
  exerciseCreateSchema,
  exerciseGenerateSchema,
  exerciseShareSchema,
  exerciseUpdateSchema,
  exerciseDeleteSchema,
} from './validations';
import { HttpError } from 'wasp/server';
type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const createExercise: CreateExercise<{ name: string; topic_id: string | null }, Response> = async (
  input,
  context
) => {
  try {
    const validatedInput = exerciseCreateSchema.parse(input);

    const exercise = await context.entities.Exercise.create({
      data: {
        name: validatedInput.name,
        user: context.user ? { connect: { id: context.user.id } } : undefined,
        lesson_text: '',
        level: '',
        truncated: false,
        tokens: 0,
        model: '',
        word_count: 0,
        topic: validatedInput.topic_id ? { connect: { id: validatedInput.topic_id } } : undefined,
      },
    });

    return {
      success: true,
      message: 'Exercise created successfully',
      data: exercise,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'An error occurred while creating the exercise',
      data: null,
    };
  }
};

const createModule = async (
  context: string,
  topic: string,
  model: string,
  prePrompt: string,
  postPrompt: string
): Promise<{ content: string; tokens: number }> => {
  try {
    console.log('topic', topic);
    const exercise_response = await LLMFactory.generateModule(context, topic, model, prePrompt, postPrompt);

    if (!exercise_response.success || !exercise_response.data) {
      throw new Error(`Error generating exercise content for topic ${topic}: ${exercise_response.message}`);
    }

    return {
      content: exercise_response.data,
      tokens: exercise_response.usage || 0,
    };
  } catch (error) {
    throw error;
  }
};

export const generateExercise: GenerateExercise<
  {
    exercise_id: string;
    selected_topics: string[];
    length: string;
    level: string;
    model: string;
    include_mc_quiz: boolean;
  },
  Response
> = async (input, context) => {
  try {
    const validatedInput = exerciseGenerateSchema.parse(input);

    if (context.user && context.user.credits < 1) {
      throw new Error('Insufficient credits. Please top up your credits to continue.');
    }

    const exercise = await context.entities.Exercise.findUnique({
      where: { id: validatedInput.exercise_id },
    });
    if (!exercise) {
      throw new Error('Exercise not found');
    }

    let exercise_content_url;
    try {
      exercise_content_url = await getS3DownloadUrl({ key: validatedInput.exercise_id + '.txt' });
    } catch (error) {
      console.error('Error getting S3 download URL:', error);
      throw new Error('Failed to retrieve exercise content URL');
    }

    const response = await fetch(exercise_content_url);
    if (!response.ok) {
      throw new Error('Failed to download exercise content');
    }

    const raw_exercise_text = await response.text();
    const { text: truncated_exercise_text, truncated } = truncateText(raw_exercise_text);

    // Update status to processing
    await context.entities.Exercise.update({
      where: { id: validatedInput.exercise_id },
      data: {
        modules: Object.fromEntries(validatedInput.selected_topics.map((topic) => [topic, null])),
        status: ExerciseStatus.EXERCISE_GENERATED,
      },
    });

    const prompt_settings = context.user
      ? await context.entities.ExerciseGeneratePrompt.findFirst({
          where: { user_id: context.user.id },
        })
      : null;
    const pre_prompt = prompt_settings?.pre_prompt || DEFAULT_PRE_PROMPT;
    const post_prompt = prompt_settings?.post_prompt || DEFAULT_POST_PROMPT;

    // Process each topic individually
    const selected_topics_array = Array.isArray(validatedInput.selected_topics)
      ? validatedInput.selected_topics
      : typeof validatedInput.selected_topics === 'string'
        ? [validatedInput.selected_topics]
        : [];

    // Initialize combined content
    let combined_content = '';
    let total_tokens = 0;
    // Process each selected topic as a separate module
    for (const topic of selected_topics_array) {
      try {
        const moduleResult = await createModule(
          truncated_exercise_text,
          topic,
          validatedInput.model,
          pre_prompt,
          post_prompt
        );

        // Add a clear section header for each topic
        combined_content += `${moduleResult.content}\n\n`;
        total_tokens += moduleResult.tokens;

        // Get current exercise to merge with existing modules
        const currentExercise = await context.entities.Exercise.findUnique({
          where: { id: validatedInput.exercise_id },
          select: { modules: true },
        });

        // Merge new module with existing modules
        const updatedModules = {
          ...(currentExercise?.modules as Record<string, string>),
          [topic]: moduleResult.content,
        };

        // Update status and modules
        await context.entities.Exercise.update({
          where: { id: validatedInput.exercise_id },
          data: {
            modules: updatedModules,
            status: ExerciseStatus.EXERCISE_GENERATED,
          },
        });
      } catch (error) {
        console.error(`Error processing topic ${topic}:`, error);
        // Continue with other topics if one fails
      }
    }

    try {
      await context.entities.Exercise.update({
        where: { id: validatedInput.exercise_id },
        data: {
          lesson_text: combined_content || '',
          level: validatedInput.level,
          truncated,
          tokens: total_tokens,
          model: validatedInput.model,
          word_count: combined_content.split(' ').length || parseInt(validatedInput.length, 10),
          status: 'FINISHED',
        },
      });
    } catch (error: any) {
      await handleError(context.user?.email || 'demo', error, 'updateExercise');
    }

    // Process audio for <listen> tags if they exist
    if (combined_content.includes('<listen>')) {
      const document_parser_url = process.env.DOCUMENT_PARSER_URL;
      if (document_parser_url) {
        try {
          const form_data = new FormData();
          form_data.append('exercise_id', validatedInput.exercise_id);
          form_data.append('generate_text', combined_content || '');
          const audio_response = await fetch(`${document_parser_url}/api/generate-audio`, {
            method: 'POST',
            body: form_data,
          });
          if (!audio_response.ok) {
            await handleError(context.user?.email || 'demo', audio_response, 'generateAudio');
          }
        } catch (err) {
          await handleError(context.user?.email || 'demo', err, 'generateAudio');
        }
      }
    }

    if (context.user) {
      try {
        await context.entities.User.update({
          where: { id: context.user.id },
          data: { credits: { decrement: 1 } },
        });
      } catch (err) {
        await handleError(context.user?.email || 'demo', err, 'deductCredit');
      }
    }

    return {
      success: true,
      message: 'Exercise generated successfully',
      data: null,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'An error occurred while generating the exercise',
      data: null,
    };
  }
};

export const shareExercise: ShareExercise<{ exercise_id: string; emails: Array<string> }, Response> = async (
  input,
  context
) => {
  try {
    const validatedInput = exerciseShareSchema.parse(input);

    const user = validateUserAccess(context);

    const exercise = await context.entities.Exercise.findUnique({
      where: { id: validatedInput.exercise_id, user_id: user.id },
    });

    if (!exercise) {
      throw new Error('Exercise not found');
    }

    await Promise.all(
      validatedInput.emails.map(async (email) => {
        await context.entities.Exercise.create({
          data: {
            name: exercise.name,
            lesson_text: exercise.lesson_text,
            level: exercise.level,
            truncated: exercise.truncated,
            tokens: exercise.tokens,
            model: exercise.model,
            word_count: exercise.word_count,
            user: { connect: { email } },
            topic: exercise.topic_id ? { connect: { id: exercise.topic_id } } : undefined,
          },
        });
      })
    );
    return {
      success: true,
      message: 'Exercise shared successfully',
      data: null,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'An error occurred while sharing the exercise',
      data: null,
    };
  }
};

export const updateExercise: UpdateExercise<{ id: string; updated_data: Partial<Exercise> }, Response> = async (
  input,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const validatedInput = exerciseUpdateSchema.parse(input);

    const user = validateUserAccess(context);

    // Fetch the current exercise to compare <listen> tags content
    const currentExercise = await context.entities.Exercise.findUnique({
      where: { id: validatedInput.id, user_id: user.id },
      select: { lesson_text: true },
    });

    if (!currentExercise) {
      throw new Error('Exercise not found');
    }

    if (validatedInput.updated_data.lesson_text && validatedInput.updated_data.lesson_text.length > 0) {
      validatedInput.updated_data.word_count = validatedInput.updated_data.lesson_text.split(' ').length;

      // Check if the lesson_text contains <listen> tags and if content has changed
      const newLessonText = validatedInput.updated_data.lesson_text;
      if (newLessonText.includes('<listen>')) {
        // Extract content from <listen> tags in new and current lesson text
        const extractListenContent = (text: string) => {
          const matches = text.match(/<listen>([\s\S]*?)<\/listen>/g);
          return matches ? matches.join('') : '';
        };

        const newListenContent = extractListenContent(newLessonText);
        const currentListenContent = extractListenContent(currentExercise.lesson_text);

        // If content within <listen> tags has changed, regenerate audio
        if (newListenContent !== currentListenContent) {
          const document_parser_url = process.env.DOCUMENT_PARSER_URL;
          if (!document_parser_url) {
            throw new Error('DOCUMENT_PARSER_URL is not set');
          }

          try {
            const form_data = new FormData();
            form_data.append('exercise_id', validatedInput.id);
            form_data.append('generate_text', newLessonText);
            const audio_response = await fetch(`${document_parser_url}/api/generate-audio`, {
              method: 'POST',
              body: form_data,
            });

            if (!audio_response.ok) {
              throw new Error('Failed to generate audio');
            }
          } catch (err) {
            console.error('Error regenerating audio:', err);
          }
        }
      }
    }

    if (validatedInput.updated_data.cursor !== undefined) {
      validatedInput.updated_data.cursor = Math.max(0, validatedInput.updated_data.cursor);
    }

    const updated_exercise = await context.entities.Exercise.update({
      where: { id: validatedInput.id, user_id: user.id },
      data: validatedInput.updated_data,
    });

    return {
      success: true,
      message: 'Exercise updated successfully',
      data: updated_exercise,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'An error occurred while updating the exercise',
      data: null,
    };
  }
};

export const deleteExercise: DeleteExercise<{ id: string }, Response> = async (input, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const validatedInput = exerciseDeleteSchema.parse(input);

    const user = validateUserAccess(context);

    await deleteS3Objects({ key: validatedInput.id });

    await context.entities.Exercise.delete({
      where: {
        id: validatedInput.id,
        user_id: user.id,
      },
    });

    return {
      success: true,
      message: 'Exercise deleted successfully',
      data: null,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'An error occurred while deleting the exercise',
      data: null,
    };
  }
};
