import { type Course } from 'wasp/entities';
import { type CreateCourse, type UpdateCourse, type DeleteCourse, type DuplicateCourse } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Create a new course
 */
export const createCourse: CreateCourse<Partial<Course>, Response> = async (
  courseData: Partial<Course>,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const course = await context.entities.Course.create({
      data: {
        ...courseData,
        user_id: context.user.id,
      },
    });
    return {
      success: true,
      message: 'Course created successfully',
      data: course,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error creating course');
  }
};

/**
 * Update an existing course
 */
export const updateCourse: UpdateCourse<Partial<Course>, Response> = async (
  courseData: Partial<Course>,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const course = await context.entities.Course.update({
      where: {
        id: courseData.id,
        user_id: context.user.id,
      },
      data: courseData,
    });
    return {
      success: true,
      message: 'Course updated successfully',
      data: course,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error updating course');
  }
};

/**
 * Delete a course
 */
export const deleteCourse: DeleteCourse<Partial<Course>, Response> = async (
  courseData: Partial<Course>,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const course = await context.entities.Course.delete({
      where: { 
        id: courseData.id,
        user_id: context.user.id,
      },
    });
    return {
      success: true,
      message: 'Course deleted successfully',
      data: course,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error deleting course');
  }
};

/**
 * Duplicate a course
 */
export const duplicateCourse: DuplicateCourse<Partial<Course>, Response> = async (
  courseData: Partial<Course>,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const existingCourse = await context.entities.Course.findUnique({
      where: { 
        id: courseData.id,
        is_public: true
      },
      include: {
        topics: {
          include: {
            exercises: {
              include: {
                questions: {
                  include: {
                    options: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!existingCourse) {
      throw new HttpError(404, 'Course not found');
    }

    const duplicatedCourse = await context.entities.Course.create({
      data: {
        name: `${existingCourse.name} (Copy)`,
        image: existingCourse.image,
        description: existingCourse.description,
        user_id: context.user.id,
        is_public: false,
        topics: {
          create: existingCourse.topics.map((topic: any) => ({
            name: topic.name,
            length: topic.length,
            level: topic.level,
            user_id: context.user.id,
            created_at: topic.created_at,
            exercises: {
              create: topic.exercises.map((exercise: any) => ({
                name: exercise.name,
                description: exercise.description,
                type: exercise.type,
                length: exercise.length,
                level: exercise.level,
                user_id: context.user.id,
                questions: {
                  create: exercise.questions.map((question: any) => ({
                    text: question.text,
                    type: question.type,
                    points: question.points,
                    options: {
                      create: question.options.map((option: any) => ({
                        text: option.text,
                        is_correct: option.is_correct
                      })),
                    },
                  })),
                },
              })),
            },
          })),
        },
      },
    });

    return {
      success: true,
      message: 'Course duplicated successfully',
      data: duplicatedCourse,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error duplicating course');
  }
};
