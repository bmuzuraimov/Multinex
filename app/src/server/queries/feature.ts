import { type GetAllFeatures, type GetFeature } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Get all features with filtering, selection and include options
 */
export const getAllFeatures: GetAllFeatures<
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
  context: { entities: { Feature: any } }
) => {
  try {
    const features = await context.entities.Feature.findMany({
      where: args?.where,
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'Features retrieved successfully',
      data: features,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error retrieving features', { error });
  }
};

/**
 * Get feature by ID with selection and include options
 */
export const getFeature: GetFeature<
  {
    id: string;
    select?: any;
    include?: any;
  },
  Response
> = async (
  { id, select, include }: { id: string; select?: any; include?: any },
  context: { entities: { Feature: any } }
) => {
  try {
    if (!id) {
      throw new HttpError(400, 'Feature ID is required');
    }

    const feature = await context.entities.Feature.findUnique({
      where: { id },
      select,
      include,
    });

    if (!feature) {
      throw new HttpError(404, 'Feature not found');
    }

    return {
      success: true,
      message: 'Feature retrieved successfully',
      data: feature,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving feature', { error });
  }
};
