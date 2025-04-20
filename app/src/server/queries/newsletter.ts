import { type GetAllNewsletters, type GetNewsletter } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Get all newsletters with filtering, selection and include options
 */
export const getAllNewsletters: GetAllNewsletters<
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
  context: { entities: { Newsletter: any } }
) => {
  try {
    const newsletters = await context.entities.Newsletter.findMany({
      where: args?.where,
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'Newsletters retrieved successfully',
      data: newsletters,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error retrieving newsletters', { error });
  }
};

/**
 * Get newsletter by ID with selection and include options
 */
export const getNewsletter: GetNewsletter<
  {
    id: string;
    select?: any;
    include?: any;
  },
  Response
> = async (
  { id, select, include }: { id: string; select?: any; include?: any },
  context: { entities: { Newsletter: any } }
) => {
  try {
    if (!id) {
      throw new HttpError(400, 'Newsletter ID is required');
    }

    const newsletter = await context.entities.Newsletter.findUnique({
      where: { id },
      select,
      include,
    });

    if (!newsletter) {
      throw new HttpError(404, 'Newsletter not found');
    }

    return {
      success: true,
      message: 'Newsletter retrieved successfully',
      data: newsletter,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving newsletter', { error });
  }
};
