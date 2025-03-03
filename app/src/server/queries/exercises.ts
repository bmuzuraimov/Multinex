import { type Exercise, type Option } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import {
  type GetExercisesWithNoTopic,
  type GetExerciseById,
  type HasCompletedExercises,
} from 'wasp/server/operations';
import { getS3DownloadUrl } from '../utils/s3Utils';
import { preprocessEssay } from '../utils/exerciseUtils';
import { ExerciseStatus } from '@prisma/client';

export const getExercisesWithNoTopic: GetExercisesWithNoTopic<void, Exercise[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const documentParserUrl = process.env.DOCUMENT_PARSER_URL;
  if (!documentParserUrl) {
    throw new HttpError(500, 'DOCUMENT_PARSER_URL is not set');
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
      completed: true,
    },
  });

  return exercise !== null;
};

type ExerciseResult = {
  id: string;
  status: ExerciseStatus;
  name: string;
  paragraphSummary: string;
  level: string;
  truncated: boolean;
  no_words: number;
  completed: boolean;
  completedAt: Date | null;
  score: number;
  model: string;
  userEvaluation: number | null;
  userId: string | null;
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
  audioTimestamps?: Array<{ word: string; start: number; end: number }> | string[];
  essay: string;
  formattedEssay: {
    mode: 'listen' | 'type' | 'write';
    text: string[];
  }[];
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
      topic: true,
      user: true,
    },
  });

  if (exercise.audioTimestamps && typeof exercise.audioTimestamps[0] === 'string') {
    exercise.audioTimestamps = exercise.audioTimestamps.map((timestamp: string) => JSON.parse(timestamp));
  }

  const audioUrl = await getS3DownloadUrl({ key: exercise.id + '.mp3' });
  const { essay, formattedEssay } = preprocessEssay(exercise.lessonText);

  return {
    ...exercise,
    essay,
    formattedEssay,
    audioUrl,
  };
};
