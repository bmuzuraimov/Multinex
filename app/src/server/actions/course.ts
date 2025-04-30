import { type Course } from 'wasp/entities';
import { type CreateCourse, type UpdateCourse, type DeleteCourse, type DuplicateCourse } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';
import { duplicateS3Object } from '../utils/s3Utils';

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

    // Create the duplicate course with all associated data
    const duplicatedCourse = await context.entities.Course.create({
      data: {
        name: `${existingCourse.name} (Copy)`,
        image: existingCourse.image,
        description: existingCourse.description,
        user_id: context.user.id,
        is_public: false,
        duplicate_id: existingCourse.id,
        created_at: new Date(),
        topics: {
          create: existingCourse.topics.map((topic: any) => ({
            name: topic.name,
            length: topic.length,
            level: topic.level,
            user_id: context.user.id,
            created_at: new Date(),
            exercises: {
              create: topic.exercises.map((exercise: any) => ({
                name: exercise.name,
                description: exercise.description,
                type: exercise.type,
                length: exercise.length,
                level: exercise.level,
                status: exercise.status,
                lesson_text: exercise.lesson_text,
                modules: exercise.modules,
                audio_timestamps: exercise.audio_timestamps,
                cursor: exercise.cursor,
                word_count: exercise.word_count,
                completed: exercise.completed,
                truncated: exercise.truncated,
                tokens: exercise.tokens,
                model: exercise.model,
                user_evaluation: exercise.user_evaluation,
                user_id: context.user.id,
                created_at: new Date(),
                questions: {
                  create: exercise.questions.map((question: any) => ({
                    text: question.text,
                    type: question.type,
                    points: question.points,
                    created_at: new Date(),
                    options: {
                      create: question.options.map((option: any) => ({
                        text: option.text,
                        is_correct: option.is_correct,
                        explanation: option.explanation,
                        created_at: new Date()
                      })),
                    },
                  })),
                },
              })),
            },
          })),
        },
      },
      include: {
        topics: {
          include: {
            exercises: true
          }
        }
      }
    });

    // Duplicate all S3 files for the new exercises
    // Map original exercise IDs to new exercise IDs for S3 file duplication
    const exerciseIdMap = new Map();
    
    // Create a flat list of all exercises from the original course
    const flatOriginalExercises = existingCourse.topics.flatMap((topic: any) => 
      topic.exercises.map((exercise: any) => ({
        id: exercise.id,
        topicId: topic.id
      }))
    );
    
    // Create a flat list of all exercises from the duplicated course
    const flatDuplicatedExercises = duplicatedCourse.topics.flatMap((topic: any) => 
      topic.exercises.map((exercise: any) => ({
        id: exercise.id,
        topicId: topic.id
      }))
    );
    
    // Map original exercise IDs to new exercise IDs based on their position
    for (let i = 0; i < flatOriginalExercises.length; i++) {
      if (i < flatDuplicatedExercises.length) {
        exerciseIdMap.set(flatOriginalExercises[i].id, flatDuplicatedExercises[i].id);
      }
    }
    
    // Duplicate S3 files for each exercise
    const s3DuplicationPromises = Array.from(exerciseIdMap.entries()).map(([sourceId, destinationId]) => {
      return duplicateS3Object({
        source_key: sourceId,
        destination_key: destinationId
      });
    });
    
    await Promise.all(s3DuplicationPromises);

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
