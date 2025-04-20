import { type GetDemoExercise, type GetAllDemoExercises } from 'wasp/server/operations';
import { preprocessEssay } from '../utils/exerciseUtils';
import { getS3DownloadUrl } from '../utils/s3Utils';
import { DemoExercise } from 'wasp/entities';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const getDemoExercise: GetDemoExercise<Partial<DemoExercise>, Response> = async (args, context) => {
  try {
    if (!args.user_agent || !args.browser_language || !args.screen_resolution || !args.timezone) {
      throw new HttpError(400, 'Missing required fields');
    }

    const demo_exercise = await context.entities.DemoExercise.findFirst({
      where: {
        user_agent: args.user_agent,
        browser_language: args.browser_language,
        screen_resolution: args.screen_resolution,
        timezone: args.timezone,
      },
      include: {
        exercise: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!demo_exercise) {
      throw new HttpError(404, 'Demo exercise not found');
    }

    const audio_timestamps =
      demo_exercise.exercise.audio_timestamps?.map((timestamp: string) => {
        if (typeof timestamp === 'string') {
          return JSON.parse(timestamp) as AudioTimestamp;
        }
        return timestamp as AudioTimestamp;
      }) || [];

    const { essay, formattedEssay } = preprocessEssay(demo_exercise.exercise.lesson_text);
    const audio_url = await getS3DownloadUrl({ key: demo_exercise.exercise.id + '.mp3' });

    return {
      success: true,
      message: 'Demo exercise fetched successfully',
      data: {
        ...demo_exercise,
        essay,
        formatted_essay: formattedEssay,
        audio_url: audio_url,
        exercise: {
          ...demo_exercise.exercise,
          audio_timestamps: audio_timestamps,
        },
      },
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error fetching demo exercise', { error });
  }
};

export const getAllDemoExercises: GetAllDemoExercises<
  {
    where?: any;
    select?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  },
  Response
> = async (
  args: {
    where?: any;
    select?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  },
  context: { entities: { DemoExercise: any } }
) => {
  try {
    const demo_exercises = await context.entities.DemoExercise.findMany({
      where: args?.where,
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'Demo exercises fetched successfully',
      data: demo_exercises,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error fetching demo exercises', { error });
  }
};
