import { Feature } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type CreateFeature, type UpdateFeature } from 'wasp/server/operations';

export const createFeature: CreateFeature<{
  name: string;
  bounty: number;
  date: string;
  completed: boolean;
}> = async (feature, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Feature.create({
    data: feature,
  });
};

export const updateFeature: UpdateFeature<{
  id: string;
  data: Partial<Feature>;
}> = async ({ id, data }, context) => {
  return context.entities.Feature.update({ where: { id }, data });
};
