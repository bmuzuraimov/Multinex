import { type Question } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type CreateQuestion } from 'wasp/server/operations';

export const createQuestion: CreateQuestion<
  { text: string; exerciseId: string; options: { text: string; isCorrect: boolean }[] },
  Question
> = async ({ text, exerciseId, options }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Question.create({
    data: {
      text,
      exercise: { connect: { id: exerciseId } },
      options: {
        create: options.map((option) => ({
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      },
    },
  });
};
