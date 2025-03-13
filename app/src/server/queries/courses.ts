import { type Course } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import {
  type GetAllCourses,
  type GetCourseById,
  type GetPublicCourses,
} from 'wasp/server/operations';

type GetAllCoursesResponse = {
  courses: {
    id: string;
    name: string;
    description: string | null;
    created_at: Date;
    total_exercises: number;
    completed_exercises: number;
  }[];
}

export const getAllCourses: GetAllCourses<void, GetAllCoursesResponse> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const courses = await context.entities.Course.findMany({
    where: {
      user_id: context.user.id,
    },
    include: {
      topics: {
        include: {
          exercises: true
        }
      }
    },
    orderBy: {
      created_at: 'asc',
    }
  });

  const courses_with_stats = courses.map(course => {
    let total_exercises = 0;
    let completed_exercises = 0;

    course.topics.forEach(topic => {
      total_exercises += topic.exercises.length;
      completed_exercises += topic.exercises.filter(exercise => exercise.completed).length;
    });

    return {
      ...course,
      total_exercises,
      completed_exercises
    };
  });

  return {
    courses: courses_with_stats
  };
}

type GetPublicCoursesResponse = {
  courses: (Course & {
    total_topics: number;
    total_exercises: number;
  })[];
}

export const getPublicCourses: GetPublicCourses<void, GetPublicCoursesResponse> = async (_args, context) => {
  const courses = await context.entities.Course.findMany({
    where: { is_public: true },
    include: {
      topics: {
        include: {
          exercises: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      created_at: 'asc',
    }
  });

  const courses_with_stats = courses.map(course => {
    const total_topics = course.topics.length;
    const total_exercises = course.topics.reduce((sum, topic) => sum + topic.exercises.length, 0);

    return {
      ...course,
      total_topics,
      total_exercises
    };
  });

  return {
    courses: courses_with_stats
  };
};

export const getCourseById: GetCourseById<{ course_id: string }, Course | null> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const { course_id } = args;
  return context.entities.Course.findFirst({
    where: {
      user_id: context.user.id,
      id: course_id,
    },
  });
}