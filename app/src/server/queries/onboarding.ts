import { HttpError } from 'wasp/server';
import { type GetOnboarding, type GetAllOnboardings } from 'wasp/server/operations';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Get onboarding by ID with selection and include options
 */
export const getOnboarding: GetOnboarding<
  {
    select?: any;
    include?: any;
  },
  Response
> = async ({ select, include }: { select?: any; include?: any }, context: any) => {
  try {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
    }

    const onboarding = await context.entities.Onboarding.findUnique({
      where: { user_id: context.user.id },
      select,
      include,
    });

    if (!onboarding) {
      throw new HttpError(404, 'Onboarding not found');
    }

    return {
      success: true,
      message: 'Onboarding retrieved successfully',
      data: onboarding,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving onboarding', { error });
  }
};

/**
 * Get all onboardings with filtering, selection and include options
 */
export const getAllOnboardings: GetAllOnboardings<
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
  try {
    const onboardings = await context.entities.Onboarding.findMany({
      where: { ...args?.where, user_id: context.user.id },
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'Onboardings retrieved successfully',
      data: onboardings,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving onboardings', { error });
  }
};
