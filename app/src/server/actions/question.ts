import { type CreateQuestion, type UpdateQuestion, type DeleteQuestion } from 'wasp/server/operations';
import { Question } from 'wasp/entities';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const createQuestion: CreateQuestion<Partial<Question>, Response> = async (
  questionData: Partial<Question>,
  context: { entities: { Question: any } }
) => {
  try {
    const question = await context.entities.Question.create({
      data: questionData,
    });
    return {
      success: true,
      message: 'Question created successfully',
      data: question,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Failed to create question', { error });
  }
};

export const updateQuestion: UpdateQuestion<Partial<Question>, Response> = async (
  questionData: Partial<Question>,
  context: { entities: { Question: any } }
) => {
  try {
    const question = await context.entities.Question.update({
      where: { id: questionData.id },
      data: questionData,
    });
    return {
      success: true,
      message: 'Question updated successfully',
      data: question,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Failed to update question', { error });
  }
};

export const deleteQuestion: DeleteQuestion<Partial<Question>, Response> = async (
  questionData: Partial<Question>,
  context: { entities: { Question: any } }
) => {
  try {
    const question = await context.entities.Question.delete({
      where: { id: questionData.id },
    });
    return {
      success: true,
      message: 'Question deleted successfully',
      data: question,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Failed to delete question', { error });
  }
};
