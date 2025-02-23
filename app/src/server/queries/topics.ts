import { HttpError } from 'wasp/server';
import {
  type GetTopicsByCourse,
} from 'wasp/server/operations';
import { Exercise } from 'wasp/entities';
import { ExerciseStatus } from '@prisma/client';

type TopicsByCourse = {
  id: string;
  name: string;
  courseId: string;
  length: number;
  level: string;
  exercises: {
    id: string;
    status: ExerciseStatus;
    name: string;
    level: string;
    lessonText: string;
    truncated: boolean;
    no_words: number;
    completed: boolean;
    completedAt: Date | null;
    score: number;
  }[];
};

export const getTopicsByCourse: GetTopicsByCourse<{ courseId: string }, TopicsByCourse[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const { courseId } = args;
  return context.entities.Topic.findMany({
    where: {
      userId: context.user.id,
      courseId: courseId,
    },
    include: {
      exercises: {
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          status: true,
          name: true,
          level: true,
          lessonText: true,
          truncated: true,
          no_words: true,
          completed: true,
          completedAt: true,
          score: true,
        }
      }
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
};