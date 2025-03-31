import { type Exercise, type Option } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import {
  type GetExercisesWithNoTopic,
  type GetExerciseById,
  type HasCompletedExercises,
  type GetExerciseAnalytics,
} from 'wasp/server/operations';
import { getS3DownloadUrl } from '../utils/s3Utils';
import { preprocessEssay } from '../utils/exerciseUtils';
import { SensoryMode } from '../../shared/types';
import { ExerciseStatus } from '@prisma/client';
import { ApiResponse } from '../actions/types';
import { handleError, validateUserAccess } from '../actions/utils';

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

export const getExerciseAnalytics: GetExerciseAnalytics<
  { exerciseId: string },
  ApiResponse<any>
> = async ({ exerciseId }, context) => {
  try {
    const user = validateUserAccess(context);

    // Check if the user owns the original exercise
    const originalExercise = await context.entities.Exercise.findFirst({
      where: {
        id: exerciseId,
        user_id: user.id,
      },
    });

    if (!originalExercise) {
      return {
        success: false,
        code: 404,
        message: 'Exercise not found or you do not have permission to view analytics',
      };
    }

    // Find all duplicates of this exercise (shared copies)
    const sharedExercises = await context.entities.Exercise.findMany({
      where: {
        duplicate_id: exerciseId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    // Calculate analytics
    const totalShares = sharedExercises.length;
    const completedExercises = sharedExercises.filter(ex => ex.completed);
    const totalCompletions = completedExercises.length;
    
    // Calculate scores and time spent
    const scores = sharedExercises
      .filter(ex => ex.completed && ex.score !== null)
      .map(ex => ex.score)
      .filter((score): score is number => score !== null);
    
    const timeSpentValues = sharedExercises
      .filter(ex => ex.completed && ex.time_taken !== null)
      .map(ex => ex.time_taken)
      .filter((time): time is number => time !== null);

    // Calculate averages
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;
    
    const averageTimeSpent = timeSpentValues.length > 0
      ? timeSpentValues.reduce((sum, time) => sum + time, 0) / timeSpentValues.length
      : 0;
    
    const completionRate = totalShares > 0 
      ? (totalCompletions / totalShares) * 100 
      : 0;

    // Prepare user progress data
    const userProgress = sharedExercises.map(ex => {
      return {
        email: ex.user?.email || 'Unknown user',
        completed: ex.completed,
        score: ex.score,
        timeSpent: ex.time_taken,
        startedAt: ex.started_at ? ex.started_at.toISOString() : null,
        completedAt: ex.completed_at ? ex.completed_at.toISOString() : null,
      };
    });

    return {
      success: true,
      code: 200,
      message: 'Analytics retrieved successfully',
      data: {
        totalShares,
        totalCompletions,
        averageScore,
        averageTimeSpent,
        completionRate,
        userProgress,
      },
    };
  } catch (error) {
    return handleError(context.user?.email || 'demo', error, 'getExerciseAnalytics');
  }
};