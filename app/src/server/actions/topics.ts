import { type Topic } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type CreateTopic, type UpdateTopic, type DeleteTopic } from 'wasp/server/operations';
import { ApiResponse } from './types';

export const createTopic: CreateTopic<{ name: string; course_id: string }, ApiResponse<Topic>> = async (
  { name, course_id },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const created_topic = await context.entities.Topic.create({
    data: {
      name,
      course: { connect: { id: course_id } },
      user: { connect: { id: context.user.id } },
    },
  });

  return {
    success: true,
    code: 200,
    message: 'Topic created successfully',
    data: created_topic,
  };
};

export const updateTopic: UpdateTopic<{ id: string; data: Partial<Topic> }, ApiResponse<Topic>> = async (
  { id, data },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const updated_topic = await context.entities.Topic.update({
    where: {
      id,
    },
    data,
  });

  return {
    success: true,
    code: 200,
    message: 'Topic updated successfully',
    data: updated_topic,
  };
};

export const deleteTopic: DeleteTopic<{ id: string }, ApiResponse<Topic>> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const deleted_topic = await context.entities.Topic.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
    code: 200,
    message: 'Topic deleted successfully',
    data: deleted_topic,
  };
};
