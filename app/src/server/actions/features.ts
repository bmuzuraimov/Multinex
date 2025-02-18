import { type Feature } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type CreateFeature } from 'wasp/server/operations';
import { ADMIN_EMAIL } from '../../shared/constants';

export const createFeature: CreateFeature<
  { name: string; bounty: number; date: Date; completed: boolean },
  Feature
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
    if (!context.user || context.user.email !== ADMIN_EMAIL) {
      throw new HttpError(401);
    }
    return await context.entities.Feature.create({
      data: {
        name,
        bounty,
        date,
        completed,
      },
    });
  } catch (error) {
    console.error('Error creating feature:', error);
    if (error instanceof HttpError) {
      throw error; // Re-throw HTTP errors
    }
    throw new Error('Failed to create feature. Please try again.');
  }
};
