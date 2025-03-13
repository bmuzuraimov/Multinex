import { type Course } from 'wasp/entities';
import {
  type CreateCourse,
  type GenerateCourse,
  type UpdateCourse,
  type DeleteCourse,
  DuplicateCourse,
} from 'wasp/server/operations';
import { OPENAI_MODEL, MAX_TOKENS } from '../../shared/constants';
import { OpenAIService } from '../llm/models/openai';
import { handleError, validateUserAccess, truncateText } from './utils';
import { courseCreateSchema, courseUpdateSchema, courseGenerateSchema, courseIdSchema } from './validations';
import { ApiResponse } from './types';

const openai_service = new OpenAIService();

export const createCourse: CreateCourse<
  { name: string; description: string; image: string },
  ApiResponse<Course>
> = async (input, context) => {
  try {
    const user = validateUserAccess(context);
    const validatedData = courseCreateSchema.parse(input);

    const created_course = await context.entities.Course.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        image: validatedData.image,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return {
      success: true,
      code: 200,
      message: 'Course created successfully',
      data: created_course,
    };
  } catch (error) {
    return handleError(error, 'createCourse');
  }
};

export const duplicateCourse: DuplicateCourse<{ id: string }, ApiResponse<Course>> = async (input, context) => {
  try {
    const user = validateUserAccess(context);
    const { id } = courseIdSchema.parse(input);

    const original_course = await context.entities.Course.findFirst({
      where: {
        id,
        is_public: true,
      },
      include: {
        topics: {
          orderBy: { created_at: 'asc' },
          include: {
            exercises: {
              orderBy: { created_at: 'asc' },
              include: {
                questions: {
                  include: { options: true },
                },
              },
            },
          },
        },
      },
    });

    if (!original_course) {
      return { success: false, code: 404, message: 'Course not found or not public' };
    }

    // Create new course
    const new_course = await context.entities.Course.create({
      data: {
        name: `${original_course.name} (Copy)`,
        description: original_course.description,
        image: original_course.image,
        is_public: false,
        duplicate_id: original_course.id,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // Duplicate topics and their contents
    for (const topic of original_course.topics) {
      const new_topic = await context.entities.Topic.create({
        data: {
          name: topic.name,
          length: topic.length,
          level: topic.level,
          course: {
            connect: {
              id: new_course.id,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      for (const exercise of topic.exercises) {
        const new_exercise = await context.entities.Exercise.create({
          data: {
            name: exercise.name,
            lesson_text: exercise.lesson_text,
            paragraph_summary: exercise.paragraph_summary,
            level: exercise.level,
            word_count: exercise.word_count,
            model: exercise.model,
            topic: {
              connect: {
                id: new_topic.id,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        for (const question of exercise.questions) {
          const new_question = await context.entities.Question.create({
            data: {
              text: question.text,
              exercise: {
                connect: {
                  id: new_exercise.id,
                },
              },
            },
          });

          const optionPromises = question.options.map((option) =>
            context.entities.Option.create({
              data: {
                text: option.text,
                is_correct: option.is_correct,
                question: {
                  connect: {
                    id: new_question.id,
                  },
                },
              },
            })
          );
          await Promise.all(optionPromises);
        }
      }
    }

    return {
      success: true,
      code: 200,
      message: 'Course duplicated successfully',
      data: new_course,
    };
  } catch (error) {
    return handleError(error, 'duplicateCourse');
  }
};

export const generateCourse: GenerateCourse<{ syllabus_content: string; image: string }, ApiResponse> = async (
  input,
  context
) => {
  try {
    const user = validateUserAccess(context);
    const validatedData = courseGenerateSchema.parse(input);

    if (!user.credits || user.credits <= 0) {
      return { success: false, code: 403, message: 'Insufficient credits' };
    }

    // Truncate syllabus content to prevent token limit issues
    const { text: truncated_content } = truncateText(validatedData.syllabus_content);

    const generation_result = await openai_service.generateCourse(truncated_content, OPENAI_MODEL);

    if (!generation_result.success) {
      return {
        success: false,
        code: 422,
        message: generation_result.message || 'Failed to generate course content',
      };
    }

    const json_content = generation_result.data;

    const created_course = await context.entities.Course.create({
      data: {
        name: json_content.course_name,
        description: json_content.course_description,
        image: validatedData.image,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const topicPromises = (json_content.topics as string[]).map((topic_name) =>
      context.entities.Topic.create({
        data: {
          name: topic_name,
          course: {
            connect: {
              id: created_course.id,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      })
    );
    await Promise.all(topicPromises);

    const total_credits_used = Math.floor(generation_result.usage || 0);
    await context.entities.User.update({
      where: { id: user.id },
      data: {
        credits: {
          decrement: Math.min(user.credits, total_credits_used),
        },
      },
    });

    return { success: true, code: 200, message: 'Course and topics created successfully' };
  } catch (error) {
    return handleError(error, 'generateCourse');
  }
};

export const updateCourse: UpdateCourse<{ id: string; data: Partial<Course> }, ApiResponse<Course>> = async (
  input,
  context
) => {
  try {
    const user = validateUserAccess(context);
    console.log(input);
    const validatedData = courseUpdateSchema.parse(input);

    const updated_course = await context.entities.Course.update({
      where: {
        id: validatedData.id,
        user_id: user.id,
      },
      data: validatedData.data,
    });

    return {
      success: true,
      code: 200,
      message: 'Course updated successfully',
      data: updated_course,
    };
  } catch (error) {
    return handleError(error, 'updateCourse');
  }
};

export const deleteCourse: DeleteCourse<{ id: string }, ApiResponse> = async (input, context) => {
  try {
    const user = validateUserAccess(context);
    const { id } = courseIdSchema.parse(input);

    const course = await context.entities.Course.findUnique({
      where: { id, user_id: user.id },
      include: { topics: true },
    });

    if (!course) {
      return { success: false, code: 404, message: 'Course not found' };
    }

    await context.entities.Course.delete({
      where: { id, user_id: user.id },
    });

    return { success: true, code: 200, message: 'Course deleted successfully' };
  } catch (error) {
    return handleError(error, 'deleteCourse');
  }
};
