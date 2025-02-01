import { type Topic } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type CreateTopic, type UpdateTopic, type DeleteTopic } from 'wasp/server/operations';

export const createTopic: CreateTopic<{ name: string; courseId: string }, Topic> = async (
  { name, courseId },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Topic.create({
    data: {
      name,
      course: { connect: { id: courseId } },
      user: { connect: { id: context.user.id } },
    },
  });
};

export const updateTopic: UpdateTopic<{ id: string; data: Partial<Topic> }, Topic> = async ({ id, data }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Topic.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteTopic: DeleteTopic<{ id: string }, Topic> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Topic.delete({
    where: {
      id,
    },
  });
};
