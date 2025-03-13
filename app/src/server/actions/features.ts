import { type Feature } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type CreateFeature } from 'wasp/server/operations';
import { ADMIN_EMAIL } from '../../shared/constants';
import { ApiResponse } from './types';

export const createFeature: CreateFeature<
  { name: string; bounty: number; date: Date; completed: boolean },
  ApiResponse<Feature>
> = async (
  {
    name,
    bounty,
    date,
    completed,
  }: {
    name: string;
    bounty: number;
    date: Date;
    completed: boolean;
  },
  context: any
) => {
  try {
    const user_is_admin = context.user && context.user.email === ADMIN_EMAIL;
    if (!user_is_admin) {
      throw new HttpError(401);
    }

    const created_feature = await context.entities.Feature.create({
      data: {
        name,
        bounty,
        date,
        completed,
      },
    });

    return {
      success: true,
      code: 200,
      message: 'Feature created successfully',
      data: created_feature,
    };
  } catch (error) {
    console.error('Error creating feature:', error);
    if (error instanceof HttpError) {
      throw error; // Re-throw HTTP errors
    }
    throw new Error('Failed to create feature. Please try again.');
  }
};
