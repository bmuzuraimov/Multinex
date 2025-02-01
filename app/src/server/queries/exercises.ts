import { type Exercise, type Question, type Option } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type GetExercisesWithNoTopic, type GetExerciseById, type GetDemoExercise, type HasCompletedExercises } from 'wasp/server/operations';
import { getDownloadFileSignedURLFromS3 } from '../utils/s3Utils';

export const getDemoExercise: GetDemoExercise<void, ExerciseResult> = async (_args, context) => {
  const exercise = await context.entities.Exercise.findFirstOrThrow({
    where: {
      id: process.env.DEMO_EXERCISE_ID,
    },
    include: {
      questions: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          options: true,
        },
      },
      topic: true,
      user: true,
    },
  });

  const audioUrl = await getDownloadFileSignedURLFromS3({ key: exercise.id });
  return {
    ...exercise,
    audioUrl
  };
};

export const getExercisesWithNoTopic: GetExercisesWithNoTopic<void, Exercise[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Exercise.findMany({
    where: {
      userId: context.user.id,
      topicId: null,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
};

export const hasCompletedExercises: HasCompletedExercises<void, boolean> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const exercise = await context.entities.Exercise.findFirst({
    where: { 
      userId: context.user.id, 
      completed: true 
    }
  });

  return exercise !== null;
};

type ExerciseResult = {
  id: string;
  name: string;
  prompt: string;
  promptImg: string;
  lessonText: string;
  paragraphSummary: string;
  level: string;
  truncated: boolean;
  no_words: number;
  completed: boolean;
  completedAt: Date | null;
  score: number;
  model: string;
  userEvaluation: number | null;
  userId: string;
  topicId: string | null;
  createdAt: Date;
  questions: Array<{
    id: string;
    text: string;
    exerciseId: string;
    createdAt: Date;
    options: Option[];
  }>;
  audioUrl?: string;
  [key: string]: any;
};

export const getExerciseById: GetExerciseById<{ exerciseId: string }, ExerciseResult> = async (
  { exerciseId },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const exercise = await context.entities.Exercise.findFirstOrThrow({
    where: {
      userId: context.user.id,
      id: exerciseId,
    },
    include: {
      questions: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          options: true,
        },
      },
      file: true,
      topic: true,
      user: true,
    },
  });
  if (!exercise.file?.key) {
    return {
      ...exercise,
      audioUrl: undefined
    };
  }

  const audioUrl = await getDownloadFileSignedURLFromS3({ key: exercise.file.key });
  return {
    ...exercise,
    audioUrl
  };
};