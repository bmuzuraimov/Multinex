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
    createdAt: Date;
    totalExercises: number;
    completedExercises: number;
  }[];
}

export const getAllCourses: GetAllCourses<void, GetAllCoursesResponse> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const courses = await context.entities.Course.findMany({
    where: {
      userId: context.user.id,
    },
    include: {
      topics: {
        include: {
          exercises: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc',
    }
  });

  const coursesWithStats = courses.map(course => {
    let totalExercises = 0;
    let completedExercises = 0;

    course.topics.forEach(topic => {
      totalExercises += topic.exercises.length;
      completedExercises += topic.exercises.filter(exercise => exercise.completed).length;
    });

    return {
      ...course,
      totalExercises,
      completedExercises
    };
  });

  return {
    courses: coursesWithStats
  };
}

type GetPublicCoursesResponse = {
  courses: (Course & {
    totalTopics: number;
    totalExercises: number;
  })[];
}

export const getPublicCourses: GetPublicCourses<void, GetPublicCoursesResponse> = async (_args, context) => {
  const courses = await context.entities.Course.findMany({
    where: { isPublic: true },
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
      createdAt: 'asc',
    }
  });

  const coursesWithStats = courses.map(course => {
    const totalTopics = course.topics.length;
    const totalExercises = course.topics.reduce((sum, topic) => sum + topic.exercises.length, 0);

    return {
      ...course,
      totalTopics,
      totalExercises
    };
  });

  return {
    courses: coursesWithStats
  };
};

export const getCourseById: GetCourseById<{ courseId: string }, Course | null> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const { courseId } = args;
  return context.entities.Course.findFirst({
    where: {
      userId: context.user.id,
      id: courseId,
    },
  });
}