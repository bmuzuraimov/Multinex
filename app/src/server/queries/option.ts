import { type GetAllOptions, type GetOption } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Get all options with filtering, selection and include options
 */
export const getAllOptions: GetAllOptions<
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
  context: { entities: { Option: any } }
) => {
  try {
    const options = await context.entities.Option.findMany({
      where: args?.where,
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'Options retrieved successfully',
      data: options,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error retrieving options', { error });
  }
};

/**
 * Get option by ID with selection and include options
 */
export const getOption: GetOption<
  {
    id: string;
    select?: any;
    include?: any;
  },
  Response
> = async (
  { id, select, include }: { id: string; select?: any; include?: any },
  context: { entities: { Option: any } }
) => {
  try {
    if (!id) {
      throw new HttpError(400, 'Option ID is required');
    }

    const option = await context.entities.Option.findUnique({
      where: { id },
      select,
      include,
    });

    if (!option) {
      throw new HttpError(404, 'Option not found');
    }

    return {
      success: true,
      message: 'Option retrieved successfully',
      data: option,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving option', { error });
  }
};