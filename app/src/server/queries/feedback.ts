import { type GetAllFeedback, type GetFeedback } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Get all feedback with filtering, selection and include options
 */
export const getAllFeedback: GetAllFeedback<
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
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  try {
    const feedback = await context.entities.Feedback.findMany({
      where: args?.where,
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'Feedback retrieved successfully',
      data: feedback,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error retrieving feedback', { error });
  }
};

/**
 * Get feedback by ID with selection and include options
 */
export const getFeedback: GetFeedback<
  {
    id: string;
    select?: any;
    include?: any;
  },
  Response
> = async ({ id, select, include }: { id: string; select?: any; include?: any }, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  try {
    if (!id) {
      throw new HttpError(400, 'Feedback ID is required');
    }

    const feedback = await context.entities.Feedback.findUnique({
      where: { id, user_id: context.user.id },
      select,
      include,
    });

    if (!feedback) {
      throw new HttpError(404, 'Feedback not found');
    }

    return {
      success: true,
      message: 'Feedback retrieved successfully',
      data: feedback,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving feedback', { error });
  }
};
