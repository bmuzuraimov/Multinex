import { type GetUser, type GetAllUsers } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Get all users with filtering, selection and include options
 */
export const getAllUsers: GetAllUsers<
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
  context: { entities: { User: any } }
) => {
  try {
    const users = await context.entities.User.findMany({
      where: args?.where,
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error retrieving users', { error });
  }
};

/**
 * Get user by ID with selection and include options
 */
export const getUser: GetUser<
  {
    id: string;
    select?: any;
    include?: any;
  },
  Response
> = async (
  { id, select, include }: { id: string; select?: any; include?: any },
  context: { entities: { User: any } }
) => {
  try {
    if (!id) {
      throw new HttpError(400, 'User ID is required');
    }

    const user = await context.entities.User.findUnique({
      where: { id },
      select,
      include,
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving user', { error });
  }
};
