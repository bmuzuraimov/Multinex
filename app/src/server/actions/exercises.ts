import {
  type CreateExercise,
  type ShareExercise,
  type UpdateExercise,
  type DeleteExercise,
  type GenerateExercise,
  type GenerateExerciseFromText,
} from 'wasp/server/operations';
import { Exercise } from 'wasp/entities';
import { getS3DownloadUrl, deleteS3Objects } from '../utils/s3Utils';
import { truncateText, cleanMarkdown, handleError, validateUserAccess } from './utils';
import { SensoryMode } from '../../shared/types';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { ExerciseStatus } from '@prisma/client';
import { DEFAULT_PRE_PROMPT, DEFAULT_POST_PROMPT, AVAILABLE_MODELS } from '../../shared/constants';
import { LLMFactory } from '../llm/models';
import { ApiResponse } from './types';
import {
  exerciseCreateSchema,
  exerciseGenerateSchema,
  exerciseShareSchema,
  exerciseUpdateSchema,
  exerciseDeleteSchema,
  exerciseGenerateFromTextSchema,
} from './validations';

export const createExercise: CreateExercise<{ name: string; topic_id: string | null }, ApiResponse<Exercise>> = async (
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
        paragraph_summary: '',
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
      code: 200,
      message: 'Exercise created successfully',
      data: exercise,
    };
  } catch (error) {
    return handleError(context.user?.email || 'demo', error, 'createExercise');
  }
};

export const generateExercise: GenerateExercise<
  {
    exercise_id: string;
    prior_knowledge: string[];
    length: string;
    level: string;
    model: string;
    include_summary: boolean;
    include_mc_quiz: boolean;
    sensory_modes: SensoryMode[];
  },
  ApiResponse<Exercise>
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

    let generated_exercise_text: string;
    let generated_exercise_tokens: number;
    let tagged_exercise_text: string = '';
    let pre_prompt = DEFAULT_PRE_PROMPT;
    let post_prompt = DEFAULT_POST_PROMPT;
    try {
      const prior_knowledge_array = Array.isArray(validatedInput.prior_knowledge)
        ? validatedInput.prior_knowledge
        : typeof validatedInput.prior_knowledge === 'string'
          ? [validatedInput.prior_knowledge]
          : [];
      const prompt_settings = context.user
        ? await context.entities.ExerciseGeneratePrompt.findFirst({
            where: { user_id: context.user.id },
          })
        : null;
      pre_prompt = prompt_settings?.pre_prompt || DEFAULT_PRE_PROMPT;
      post_prompt = prompt_settings?.post_prompt || DEFAULT_POST_PROMPT;
      const exercise_response = await LLMFactory.generateExercise(
        truncated_exercise_text,
        prior_knowledge_array.join(','),
        validatedInput.length,
        validatedInput.level,
        validatedInput.model,
        pre_prompt,
        post_prompt
      );

      if (!exercise_response.success || !exercise_response.data) {
        throw new Error(`Error generating exercise content: ${exercise_response.message}`);
      }
      generated_exercise_text = exercise_response.data;
      generated_exercise_tokens = exercise_response.usage || 0;

      await context.entities.Exercise.update({
        where: { id: validatedInput.exercise_id },
        data: { status: ExerciseStatus.EXERCISE_GENERATED },
      });
    } catch (error) {
      throw new Error('Failed to generate exercise.');
    }

    const lecture_content = cleanMarkdown(generated_exercise_text);

    let complexity_usage = 0;
    try {
      const complexity_response = await LLMFactory.generateComplexity(
        lecture_content,
        validatedInput.model,
        validatedInput.sensory_modes
      );
      if (complexity_response.success && complexity_response.data) {
        tagged_exercise_text = complexity_response.data;
        complexity_usage = complexity_response.usage || 0;

        await context.entities.Exercise.update({
          where: { id: validatedInput.exercise_id },
          data: { status: ExerciseStatus.EXERCISE_TAGGED },
        });
      }
    } catch (error) {
      await handleError(context.user?.email || 'demo', error, 'generateComplexity');
    }

    const document_parser_url = process.env.DOCUMENT_PARSER_URL;
    if (!document_parser_url) {
      throw new Error('DOCUMENT_PARSER_URL is not set');
    }
    try {
      // Skip audio generation if no listen tags present
      if (tagged_exercise_text?.includes('<listen>')) {
        const form_data = new FormData();
        form_data.append('exercise_id', validatedInput.exercise_id);
        form_data.append('generate_text', tagged_exercise_text || '');
        const audio_response = await fetch(`${document_parser_url}/api/generate-audio`, {
          method: 'POST',
          body: form_data,
        });
        if (!audio_response.ok) {
          await handleError(context.user?.email || 'demo', audio_response, 'generateAudio');
        }
      }
    } catch (err) {
      await handleError(context.user?.email || 'demo', err, 'generateAudio');
    }

    let summary_json = null;
    if (validatedInput.include_summary) {
      try {
        const summary_response = await LLMFactory.generateSummary(
          lecture_content,
          validatedInput.model,
        );
        if (summary_response.success && summary_response.data) {
          summary_json = summary_response.data;

          await context.entities.Exercise.update({
            where: { id: validatedInput.exercise_id },
            data: { status: ExerciseStatus.SUMMARY_GENERATED },
          });
        } else {
          await handleError(context.user?.email || 'demo', new Error('Failed to generate summary (no success)'), 'generateSummary');
        }
      } catch (err) {
        await handleError(context.user?.email || 'demo', err, 'generateSummary');
      }
    }

    let questions = null;
    if (validatedInput.include_mc_quiz) {
      try {
        const questions_response = await LLMFactory.generateQuestions(
          lecture_content,
          validatedInput.model,
        );
        if (questions_response.success && questions_response.data) {
          questions = questions_response.data.questions;

          await context.entities.Exercise.update({
            where: { id: validatedInput.exercise_id },
            data: { status: ExerciseStatus.QUESTIONS_GENERATED },
          });
        } else {
          await handleError(context.user?.email || 'demo', new Error('Failed to generate questions (no success)'), 'generateQuestions');
        }
      } catch (err) {
        await handleError(context.user?.email || 'demo', err, 'generateQuestions');
      }
    }

    try {
      await context.entities.Exercise.update({
        where: { id: validatedInput.exercise_id },
        data: {
          raw_text: lecture_content || '',
          lesson_text: tagged_exercise_text || '',
          paragraph_summary: summary_json?.paragraph_summary || '',
          level: validatedInput.level,
          truncated,
          tokens:
            (generated_exercise_tokens || 0) +
            (summary_json?.tokens || 0) +
            (questions?.tokens || 0) +
            (complexity_usage || 0),
          model: validatedInput.model,
          pre_prompt: pre_prompt,
          post_prompt: post_prompt,
          word_count: lecture_content.split(' ').length || parseInt(validatedInput.length, 10),
          status: 'FINISHED',
        },
      });
    } catch (error: any) {
      await handleError(context.user?.email || 'demo', error, 'updateExercise');
    }

    if (questions && Array.isArray(questions)) {
      try {
        await Promise.all(
          questions.map(async (question: { text: string; options: Array<{ text: string; isCorrect: boolean }> }) => {
            await context.entities.Question.create({
              data: {
                text: question.text,
                exercise: { connect: { id: validatedInput.exercise_id } },
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
        await handleError(context.user?.email || 'demo', err, 'createQuestions');
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

    return { success: true, code: 200, message: 'Exercise generated successfully' };
  } catch (error) {
    return handleError(context.user?.email || 'demo', error, 'generateExercise');
  }
};

export const shareExercise: ShareExercise<
  { exercise_id: string; emails: Array<string> },
  ApiResponse<Exercise>
> = async (input, context) => {
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
            paragraph_summary: exercise.paragraph_summary,
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
    return { success: true, code: 200, message: 'Exercise shared successfully' };
  } catch (error) {
    return handleError(context.user?.email || 'demo', error, 'shareExercise');
  }
};

export const updateExercise: UpdateExercise<
  { id: string; updated_data: Partial<Exercise> },
  ApiResponse<Exercise>
> = async (input, context) => {
  try {
    const validatedInput = exerciseUpdateSchema.parse(input);

    const user = validateUserAccess(context);

    if (validatedInput.updated_data.lesson_text && validatedInput.updated_data.lesson_text.length > 0) {
      validatedInput.updated_data.word_count = validatedInput.updated_data.lesson_text.split(' ').length;
      validatedInput.updated_data.paragraph_summary = '';
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
      code: 200,
      message: 'Exercise updated successfully',
      data: updated_exercise,
    };
  } catch (error) {
    return handleError(context.user?.email || 'demo', error, 'updateExercise');
  }
};

export const deleteExercise: DeleteExercise<{ id: string }, ApiResponse<Exercise>> = async (input, context) => {
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

    return { success: true, code: 200, message: 'Exercise deleted successfully' };
  } catch (error) {
    return handleError(context.user?.email || 'demo', error, 'deleteExercise');
  }
};

export const generateExerciseFromText: GenerateExerciseFromText<
  {
    content: string;
    topic_id: string | null;
    model: string;
    include_summary: boolean;
    include_mc_quiz: boolean;
    sensory_modes: SensoryMode[];
    length: string;
    level: string;
  },
  ApiResponse<Exercise>
> = async (input, context) => {
  try {
    const validatedInput = exerciseGenerateFromTextSchema.parse(input);

    if (context.user && context.user.credits < 1) {
      throw new Error('Insufficient credits. Please top up your credits to continue.');
    }

    // Create a new exercise with the provided content
    const exercise = await context.entities.Exercise.create({
      data: {
        name: 'Generated from text',
        user: context.user ? { connect: { id: context.user.id } } : undefined,
        lesson_text: '',
        paragraph_summary: '',
        level: validatedInput.level || '',
        truncated: false,
        tokens: 0,
        model: validatedInput.model || AVAILABLE_MODELS[0] || 'gpt-4o-mini',
        word_count: 0,
        topic: validatedInput.topic_id ? { connect: { id: validatedInput.topic_id } } : undefined,
        status: ExerciseStatus.CREATED,
      },
    });

    // Truncate content to prevent token limit issues
    const { text: truncated_content, truncated } = truncateText(validatedInput.content);
    
    let generated_exercise_text: string;
    let generated_exercise_tokens: number;
    let tagged_exercise_text: string = '';
    let pre_prompt = DEFAULT_PRE_PROMPT;
    let post_prompt = DEFAULT_POST_PROMPT;
    
    try {
      const prior_knowledge_array: string[] = [];
      const prompt_settings = context.user
        ? await context.entities.ExerciseGeneratePrompt.findFirst({
            where: { user_id: context.user.id },
          })
        : null;
      pre_prompt = prompt_settings?.pre_prompt || DEFAULT_PRE_PROMPT;
      post_prompt = prompt_settings?.post_prompt || DEFAULT_POST_PROMPT;
      
      const exercise_response = await LLMFactory.generateExercise(
        truncated_content,
        prior_knowledge_array.join(','),
        validatedInput.length || 'Auto',
        validatedInput.level || 'Auto',
        validatedInput.model || AVAILABLE_MODELS[0] || 'gpt-4o-mini',
        pre_prompt,
        post_prompt
      );

      if (!exercise_response.success || !exercise_response.data) {
        throw new Error(`Error generating exercise content: ${exercise_response.message}`);
      }
      generated_exercise_text = exercise_response.data;
      generated_exercise_tokens = exercise_response.usage || 0;

      await context.entities.Exercise.update({
        where: { id: exercise.id },
        data: { status: ExerciseStatus.EXERCISE_GENERATED },
      });
    } catch (error) {
      throw new Error('Failed to generate exercise.');
    }

    const lecture_content = cleanMarkdown(generated_exercise_text);

    let complexity_usage = 0;
    try {
      const complexity_response = await LLMFactory.generateComplexity(
        lecture_content,
        validatedInput.model || AVAILABLE_MODELS[0] || 'gpt-4o-mini',
        validatedInput.sensory_modes
      );
      if (complexity_response.success && complexity_response.data) {
        tagged_exercise_text = complexity_response.data;
        complexity_usage = complexity_response.usage || 0;

        await context.entities.Exercise.update({
          where: { id: exercise.id },
          data: { status: ExerciseStatus.EXERCISE_TAGGED },
        });
      }
    } catch (error) {
      await handleError(context.user?.email || 'demo', error, 'generateComplexity');
    }

    const document_parser_url = process.env.DOCUMENT_PARSER_URL;
    if (!document_parser_url) {
      throw new Error('DOCUMENT_PARSER_URL is not set');
    }
    try {
      // Skip audio generation if no listen tags present
      if (tagged_exercise_text?.includes('<listen>')) {
        const form_data = new FormData();
        form_data.append('exercise_id', exercise.id);
        form_data.append('generate_text', tagged_exercise_text || '');
        const audio_response = await fetch(`${document_parser_url}/api/generate-audio`, {
          method: 'POST',
          body: form_data,
        });
        if (!audio_response.ok) {
          await handleError(context.user?.email || 'demo', audio_response, 'generateAudio');
        }
      }
    } catch (err) {
      await handleError(context.user?.email || 'demo', err, 'generateAudio');
    }

    let summary_json = null;
    if (validatedInput.include_summary) {
      try {
        const summary_response = await LLMFactory.generateSummary(
          lecture_content,
          validatedInput.model || AVAILABLE_MODELS[0] || 'gpt-4o-mini',
        );
        if (summary_response.success && summary_response.data) {
          summary_json = summary_response.data;

          await context.entities.Exercise.update({
            where: { id: exercise.id },
            data: { status: ExerciseStatus.SUMMARY_GENERATED },
          });
        } else {
          await handleError(context.user?.email || 'demo', new Error('Failed to generate summary (no success)'), 'generateSummary');
        }
      } catch (err) {
        await handleError(context.user?.email || 'demo', err, 'generateSummary');
      }
    }

    let questions = null;
    if (validatedInput.include_mc_quiz) {
      try {
        const questions_response = await LLMFactory.generateQuestions(
          lecture_content,
          validatedInput.model || AVAILABLE_MODELS[0] || 'gpt-4o-mini',
        );
        if (questions_response.success && questions_response.data) {
          questions = questions_response.data.questions;

          await context.entities.Exercise.update({
            where: { id: exercise.id },
            data: { status: ExerciseStatus.QUESTIONS_GENERATED },
          });
        } else {
          await handleError(context.user?.email || 'demo', new Error('Failed to generate questions (no success)'), 'generateQuestions');
        }
      } catch (err) {
        await handleError(context.user?.email || 'demo', err, 'generateQuestions');
      }
    }

    try {
      await context.entities.Exercise.update({
        where: { id: exercise.id },
        data: {
          raw_text: validatedInput.content,
          lesson_text: tagged_exercise_text || lecture_content || '',
          paragraph_summary: summary_json?.paragraph_summary || '',
          level: validatedInput.level || 'Auto',
          truncated,
          tokens:
            (generated_exercise_tokens || 0) +
            (summary_json?.tokens || 0) +
            (questions?.tokens || 0) +
            (complexity_usage || 0),
          model: validatedInput.model || AVAILABLE_MODELS[0] || 'gpt-4o-mini',
          pre_prompt: pre_prompt,
          post_prompt: post_prompt,
          word_count: lecture_content.split(' ').length || 0,
          status: ExerciseStatus.FINISHED,
        },
      });
    } catch (error: any) {
      await handleError(context.user?.email || 'demo', error, 'updateExercise');
    }

    if (questions && Array.isArray(questions)) {
      try {
        await Promise.all(
          questions.map(async (question: { text: string; options: Array<{ text: string; isCorrect: boolean }> }) => {
            await context.entities.Question.create({
              data: {
                text: question.text,
                exercise: { connect: { id: exercise.id } },
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
        await handleError(context.user?.email || 'demo', err, 'createQuestions');
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
      code: 200, 
      message: 'Exercise generated successfully',
      data: exercise
    };
  } catch (error) {
    return handleError(context.user?.email || 'demo', error, 'generateExerciseFromText');
  }
};
