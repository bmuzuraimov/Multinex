import { type Topic } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type CreateTopic, type UpdateTopic, type DeleteTopic } from 'wasp/server/operations';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const createTopic: CreateTopic<{ name: string; course_id: string }, Response> = async (
  { name, course_id },
  context
) => {
  try {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
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
      message: 'Topic created successfully',
      data: created_topic,
    };
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to create topic', { error: error.message });
  }
};

export const updateTopic: UpdateTopic<{ id: string; data: Partial<Topic> }, Response> = async (
  { id, data },
  context
) => {
  try {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
    }

    const updated_topic = await context.entities.Topic.update({
      where: {
        id,
        user_id: context.user.id,
      },
      data,
    });

    return {
      success: true,
      message: 'Topic updated successfully',
      data: updated_topic,
    };
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to update topic', { error: error.message });
  }
};

export const deleteTopic: DeleteTopic<{ id: string }, Response> = async ({ id }, context) => {
  try {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
    }

    const deleted_topic = await context.entities.Topic.delete({
      where: {
        id,
        user_id: context.user.id,
      },
    });

    return {
      success: true,
      message: 'Topic deleted successfully',
      data: deleted_topic,
    };
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to delete topic', { error: error.message });
  }
};
