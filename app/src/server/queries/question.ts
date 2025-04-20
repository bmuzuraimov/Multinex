import { type GetAllQuestions, type GetQuestion } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Get all questions with filtering, selection and include options
 */
export const getAllQuestions: GetAllQuestions<
  {
    where?: any;
    select?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  },
  Response
> = async (
  args: {
    where?: any;
    select?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  },
  context: { entities: { Question: any } }
) => {
  try {
    const questions = await context.entities.Question.findMany({
      where: args?.where,
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'Questions retrieved successfully',
      data: questions,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error retrieving questions', { error });
  }
};

/**
 * Get question by ID with selection and include options
 */
export const getQuestion: GetQuestion<
  {
    id: string;
    select?: any;
    include?: any;
  },
  Response
> = async (
  { id, select, include }: { id: string; select?: any; include?: any },
  context: { entities: { Question: any } }
) => {
  try {
    if (!id) {
      throw new HttpError(400, 'Question ID is required');
    }

    const question = await context.entities.Question.findUnique({
      where: { id },
      select,
      include,
    });

    if (!question) {
      throw new HttpError(404, 'Question not found');
    }

    return {
      success: true,
      message: 'Question retrieved successfully',
      data: question,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving question', { error });
  }
};