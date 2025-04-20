import { type GetTopic, type GetAllTopics } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Get all topics with filtering, selection and include options
 */
export const getAllTopics: GetAllTopics<
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
    const topics = await context.entities.Topic.findMany({
      where: { ...args?.where, user_id: context.user?.id },
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'Topics retrieved successfully',
      data: topics,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error retrieving topics', { error });
  }
};

/**
 * Get topic by ID with selection and include options
 */
export const getTopic: GetTopic<
  {
    id: string;
    select?: any;
    include?: any;
  },
  Response
> = async ({ id, select, include }: { id: string; select?: any; include?: any }, context: any) => {
  try {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
    }

    if (!id) {
      throw new HttpError(400, 'Topic ID is required');
    }

    const topic = await context.entities.Topic.findUnique({
      where: { id, user_id: context.user?.id },
      select,
      include,
    });

    if (!topic) {
      throw new HttpError(404, 'Topic not found');
    }

    return {
      success: true,
      message: 'Topic retrieved successfully',
      data: topic,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving topic', { error });
  }
};
