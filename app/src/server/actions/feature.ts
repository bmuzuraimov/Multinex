import { type Feature } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type CreateFeature, type UpdateFeature, type DeleteFeature } from 'wasp/server/operations';
import { ADMIN_EMAIL } from '../../shared/constants';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const createFeature: CreateFeature<Partial<Feature>, Response> = async (
  featureData: Partial<Feature>,
  context: any
) => {
  try {
    const user_is_admin = context.user && context.user.email === ADMIN_EMAIL;
    if (!user_is_admin) {
      throw new HttpError(401);
    }

    const feature = await context.entities.Feature.create({
      data: featureData,
    });
    return {
      success: true,
      message: 'Feature created successfully',
      data: feature,
    };
  } catch (error) {
    console.error('Error creating feature:', error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new Error('Failed to create feature. Please try again.');
  }
};

export const updateFeature: UpdateFeature<Partial<Feature>, Response> = async (
  featureData: Partial<Feature>,
  context: any
) => {
  try {
    const user_is_admin = context.user && context.user.email === ADMIN_EMAIL;
    if (!user_is_admin) {
      throw new HttpError(401);
    }

    const feature = await context.entities.Feature.update({
      where: { id: featureData.id },
      data: featureData,
    });
    return {
      success: true,
      message: 'Feature updated successfully',
      data: feature,
    };
  } catch (error) {
    console.error('Error updating feature:', error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new Error('Failed to update feature. Please try again.');
  }
};

export const deleteFeature: DeleteFeature<Partial<Feature>, Response> = async (
  featureData: Partial<Feature>,
  context: any
) => {
  try {
    const user_is_admin = context.user && context.user.email === ADMIN_EMAIL;
    if (!user_is_admin) {
      throw new HttpError(401);
    }

    const feature = await context.entities.Feature.delete({
      where: { id: featureData.id },
    });
    return {
      success: true,
      message: 'Feature deleted successfully',
      data: feature,
    };
  } catch (error) {
    console.error('Error deleting feature:', error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new Error('Failed to delete feature. Please try again.');
  }
};
