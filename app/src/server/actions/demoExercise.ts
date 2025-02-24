import { type CreateDemoExercise } from 'wasp/server/operations';
import { DemoExercise } from 'wasp/entities';

export const createDemoExercise: CreateDemoExercise<
  {
    exerciseId: string;
    userAgent: string;
    browserLanguage: string;
    screenResolution: string;
    timezone: string;
  },
  { success: boolean; message: string; data: DemoExercise }
> = async ({ exerciseId, userAgent, browserLanguage, screenResolution, timezone }, context) => {
  // Create the landing page try record
  const results = await context.entities.DemoExercise.create({
    data: {
      userAgent: userAgent,
      browserLanguage: browserLanguage,
      screenResolution: screenResolution,
      timezone: timezone,
      exercise: {
        connect: {
          id: exerciseId,
        },
      },
    },
  });

  return {
    success: true,
    message: 'Demo exercise created successfully',
    data: results,
  };
};
