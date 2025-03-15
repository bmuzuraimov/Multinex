import { type CreateDemoExercise } from 'wasp/server/operations';
import { DemoExercise } from 'wasp/entities';
import { handleError } from './utils';
import { demoExerciseSchema } from './validations';
import { ApiResponse } from './types';

export const createDemoExercise: CreateDemoExercise<
  {
    exercise_id: string;
    user_agent: string;
    browser_language: string;
    screen_resolution: string;
    timezone: string;
  },
  ApiResponse<DemoExercise>
> = async (input, context) => {
  try {
    // Validate input
    const validatedInput = demoExerciseSchema.parse(input);

    // Check if demo exercise already exists for this exercise
    const existingDemoExercise = await context.entities.DemoExercise.findFirst({
      where: {
        exercise_id: validatedInput.exercise_id,
      },
    });

    if (existingDemoExercise) {
      return {
        success: false,
        code: 409,
        message: 'Demo exercise already exists for this exercise within 24 hours',
      };
    }

    // Validate exercise exists and is active
    const exercise = await context.entities.Exercise.findUnique({
      where: {
        id: validatedInput.exercise_id,
      },
    });

    if (!exercise) {
      return {
        success: false,
        code: 404,
        message: 'Exercise not found or inactive',
      };
    }

    // Create the demo exercise record with sanitized input
    const demo_exercise = await context.entities.DemoExercise.create({
      data: {
        user_agent: validatedInput.user_agent.slice(0, 500),
        browser_language: validatedInput.browser_language?.slice(0, 10),
        screen_resolution: validatedInput.screen_resolution?.slice(0, 20),
        timezone: validatedInput.timezone?.slice(0, 50),
        exercise: {
          connect: {
            id: validatedInput.exercise_id,
          },
        },
      },
    });

    return {
      success: true,
      code: 200,
      message: 'Demo exercise created successfully',
      data: demo_exercise,
    };
  } catch (error) {
    return handleError(context.user?.email || 'demo', error, 'createDemoExercise');
  }
};
