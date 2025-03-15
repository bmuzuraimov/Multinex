import { type Exercise, type Option } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import {
  type GetExercisesWithNoTopic,
  type GetExerciseById,
  type HasCompletedExercises,
} from 'wasp/server/operations';
import { getS3DownloadUrl } from '../utils/s3Utils';
import { preprocessEssay } from '../utils/exerciseUtils';
import { SensoryMode } from '../../shared/types';
import { ExerciseStatus } from '@prisma/client';

export const getExercisesWithNoTopic: GetExercisesWithNoTopic<void, Exercise[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Exercise.findMany({
    where: {
      user_id: context.user.id,
      topic_id: null,
    },
    orderBy: {
      created_at: 'asc',
    },
  });
};

export const hasCompletedExercises: HasCompletedExercises<void, boolean> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const exercise = await context.entities.Exercise.findFirst({
    where: {
      user_id: context.user.id,
      completed: true,
    },
  });

  return exercise !== null;
};

type ExerciseResult = {
  id: string;
  status: ExerciseStatus;
  name: string;
  paragraph_summary: string;
  level: string;
  truncated: boolean;
  word_count: number;
  completed: boolean;
  completed_at: Date | null;
  score: number;
  model: string;
  user_evaluation: number | null;
  user_id: string | null;
  topic_id: string | null;
  created_at: Date;
  questions: Array<{
    id: string;
    text: string;
    exercise_id: string;
    created_at: Date;
    options: Option[];
  }>;
  audio_url?: string;
  audio_timestamps?: Array<{ word: string; start: number; end: number }> | string[];
  essay: string;
  formatted_essay: {
    mode: SensoryMode;
    text: string[];
  }[];
  [key: string]: any;
};

export const getExerciseById: GetExerciseById<{ exercise_id: string }, ExerciseResult> = async (
  { exercise_id },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

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
    ...exercise,
    essay,
    formatted_essay: formattedEssay,
    audio_url: audioUrl,
  };
};
