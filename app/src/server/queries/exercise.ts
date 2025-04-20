import { HttpError } from 'wasp/server';
import { type GetExercise, type GetAllExercises } from 'wasp/server/operations';
import { getS3DownloadUrl } from '../utils/s3Utils';
import { preprocessEssay } from '../utils/exerciseUtils';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const getExercise: GetExercise<{ exercise_id: string }, Response> = async (
  { exercise_id }: { exercise_id: string },
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  try {
    const exercise = await context.entities.Exercise.findFirstOrThrow({
      where: {
        user_id: context.user.id,
        id: exercise_id,
      },
      include: {
        questions: {
          orderBy: {
            created_at: 'asc',
          },
          include: {
            options: true,
          },
        },
        topic: true,
        user: true,
      },
    });

    if (exercise.audio_timestamps && typeof exercise.audio_timestamps[0] === 'string') {
      exercise.audio_timestamps = exercise.audio_timestamps.map((timestamp: string) => JSON.parse(timestamp));
    }

    const audioUrl = await getS3DownloadUrl({ key: exercise.id + '.mp3' });
    const { essay, formattedEssay } = preprocessEssay(exercise.lesson_text);

    return {
      success: true,
      message: 'Exercise retrieved successfully',
      data: {
        ...exercise,
        essay,
        formatted_essay: formattedEssay,
        audio_url: audioUrl,
      },
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving exercise', { error });
  }
};

export const getAllExercises: GetAllExercises<
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
  context: any
) => {
  try {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
    }

    const exercises = await context.entities.Exercise.findMany({
      where: {
        user_id: context.user.id,
        ...args?.where,
      },
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'Exercises retrieved successfully',
      data: exercises,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving exercises', { error });
  }
};
