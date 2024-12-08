import { Feature } from 'wasp/entities';
import {
  type GetAllFeatures,
} from 'wasp/server/operations';

export const getAllFeatures: GetAllFeatures<void, Feature[]> = async (_args, context) => {
  return context.entities.Feature.findMany();
};
