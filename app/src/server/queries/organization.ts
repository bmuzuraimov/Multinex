import { type GetOrganization, type GetAllOrganizations } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Get all organizations with filtering, selection and include options
 */
export const getAllOrganizations: GetAllOrganizations<
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
    const organizations = await context.entities.Organization.findMany({
      where: { ...args?.where, user_id: context.user.id },
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'Organizations retrieved successfully',
      data: organizations,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error retrieving organizations', { error });
  }
};

/**
 * Get organization by ID with selection and include options
 */
export const getOrganization: GetOrganization<
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
      throw new HttpError(400, 'Organization ID is required');
    }

    const organization = await context.entities.Organization.findUnique({
      where: { id, user_id: context.user.id },
      select,
      include,
    });

    if (!organization) {
      throw new HttpError(404, 'Organization not found');
    }

    return {
      success: true,
      message: 'Organization retrieved successfully',
      data: organization,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving organization', { error });
  }
};
