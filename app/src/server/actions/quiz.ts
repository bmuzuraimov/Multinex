import { type Question } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type CreateQuestion } from 'wasp/server/operations';
import { ApiResponse } from './types';

export const createQuestion: CreateQuestion<
  { text: string; exercise_id: string; options: { text: string; is_correct: boolean }[] },
  ApiResponse<Question>
> = async ({ text, exercise_id, options }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const created_question = await context.entities.Question.create({
    data: {
      text,
      exercise: { connect: { id: exercise_id } },
      options: {
        create: options.map((option) => ({
          text: option.text,
          is_correct: option.is_correct,
        })),
      },
    },
  });

  return {
    success: true,
    code: 200,
    message: 'Question created successfully',
    data: created_question,
  };
};
