import { HttpError } from 'wasp/server';
import {
  type GetTopicsByCourse,
} from 'wasp/server/operations';
import { ExerciseStatus } from '@prisma/client';

type TopicsByCourse = {
  id: string;
  name: string;
  course_id: string;
  length: number;
  level: string;
  exercises: {
    id: string;
    status: ExerciseStatus;
    name: string;
    level: string;
    lesson_text: string;
    truncated: boolean;
    word_count: number;
    completed: boolean;
    completed_at: Date | null;
  }[];
};

export const getTopicsByCourse: GetTopicsByCourse<{ course_id: string }, TopicsByCourse[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const { course_id } = args;
  return context.entities.Topic.findMany({
    where: {
      user_id: context.user.id,
      course_id: course_id,
    },
    include: {
      exercises: {
        orderBy: {
          created_at: 'asc',
        },
        select: {
          id: true,
          status: true,
          name: true,
          level: true,
          lesson_text: true,
          truncated: true,
          word_count: true,
          completed: true,
          completed_at: true,
        }
      }
    },
    orderBy: {
      created_at: 'asc',
    },
  });
};