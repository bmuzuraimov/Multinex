import { type Course } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type CreateCourse, type GenerateCourse, type UpdateCourse, type DeleteCourse, DuplicateCourse } from 'wasp/server/operations';
import { OPENAI_MODEL, MAX_TOKENS } from '../../shared/constants';
import { OpenAIService } from '../llm/openai';

export const createCourse: CreateCourse<
  { name: string; description: string; image: string },
  { success: boolean; message: string }
> = async ({ name, description, image }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  await context.entities.Course.create({
    data: {
      name,
      description,
      image,
      user: { connect: { id: context.user.id } },
    },
  });
  return { success: true, message: 'Course created successfully' };
};

export const duplicateCourse: DuplicateCourse<{ id: string }, Course> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  // Get original course with topics and exercises
  const originalCourse = await context.entities.Course.findUnique({
    where: { id },
    include: {
      topics: {
        include: {
          exercises: {
            include: {
              questions: {
                include: {
                  options: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!originalCourse) {
    throw new HttpError(404, 'Course not found');
  }

  // Create new course
  const newCourse = await context.entities.Course.create({
    data: {
      name: `${originalCourse.name} (Copy)`,
      description: originalCourse.description,
      image: originalCourse.image,
      isPublic: false,
      userId: context.user.id,
    }
  });

  // Duplicate topics and their exercises
  for (const topic of originalCourse.topics) {
    const newTopic = await context.entities.Topic.create({
      data: {
        name: topic.name,
        length: topic.length,
        level: topic.level,
        courseId: newCourse.id,
        userId: context.user.id,
      }
    });

    // Duplicate exercises and their questions
    for (const exercise of topic.exercises) {
      const newExercise = await context.entities.Exercise.create({
        data: {
          name: exercise.name,
          prompt: exercise.prompt,
          promptImg: exercise.promptImg,
          lessonText: exercise.lessonText,
          paragraphSummary: exercise.paragraphSummary,
          level: exercise.level,
          no_words: exercise.no_words,
          model: exercise.model,
          topicId: newTopic.id,
          userId: context.user.id,
        }
      });

      // Duplicate questions and their options
      for (const question of exercise.questions) {
        const newQuestion = await context.entities.Question.create({
          data: {
            text: question.text,
            exerciseId: newExercise.id,
          }
        });

        // Duplicate options
        for (const option of question.options) {
          await context.entities.Option.create({
            data: {
              text: option.text,
              isCorrect: option.isCorrect,
              questionId: newQuestion.id,
            }
          });
        }
      }
    }
  }

  return newCourse;
};

export const generateCourse: GenerateCourse<
  { syllabusContent: string; image: string },
  { success: boolean; message: string }
> = async ({ syllabusContent, image }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  try {
    const result = await OpenAIService.generateCourse(
      syllabusContent,
      OPENAI_MODEL,
      Math.min(MAX_TOKENS, context.user.tokens)
    );

    if (!result.success) {
      return {
        success: false,
        message: result.message || 'Failed to generate course content',
      };
    }

    const jsonContent = result.data;

    // Create the course
    const course = await context.entities.Course.create({
      data: {
        name: jsonContent.courseName,
        description: jsonContent.courseDescription,
        image,
        user: { connect: { id: context.user.id } },
      },
    });

    // Create topics
    for (const topicName of jsonContent.topics) {
      await context.entities.Topic.create({
        data: {
          name: topicName,
          course: { connect: { id: course.id } },
          user: { connect: { id: context.user.id } },
        },
      });
    }

    // Deduct tokens from the user's account
    const totalTokensUsed = result.usage || 0;
    await context.entities.User.update({
      where: {
        id: context.user.id,
      },
      data: {
        tokens: {
          decrement: Math.min(context.user.tokens, Math.floor(totalTokensUsed)),
        },
      },
    });

    return { success: true, message: 'Course and topics created successfully' };
  } catch (error) {
    console.error('Error generating course:', error);
    return {
      success: false,
      message: 'An unexpected error occurred while generating the course.',
    };
  }
};

export const updateCourse: UpdateCourse<{ id: string; data: Partial<Course> }, Course> = async (
  { id, data },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Course.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteCourse: DeleteCourse<{ id: string }, Course> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  await context.entities.Option.deleteMany({
    where: {
      question: {
        exercise: {
          topic: {
            course: {
              id,
            },
          },
        },
      },
    },
  });

  await context.entities.Question.deleteMany({
    where: {
      exercise: {
        topic: {
          course: {
            id,
          },
        },
      },
    },
  });

  await context.entities.Exercise.deleteMany({
    where: {
      topic: {
        course: {
          id,
        },
      },
    },
  });

  await context.entities.Topic.deleteMany({
    where: {
      course: {
        id,
      },
    },
  });

  return await context.entities.Course.delete({
    where: {
      id,
    },
  });
};
