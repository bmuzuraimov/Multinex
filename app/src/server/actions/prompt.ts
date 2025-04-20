import { ExerciseGeneratePrompt } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type CreatePrompt, type UpdatePrompt, type DeletePrompt } from 'wasp/server/operations';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const createPrompt: CreatePrompt<{ data: Partial<ExerciseGeneratePrompt> }, Response> = async (
  { data }: { data: Partial<ExerciseGeneratePrompt> },
  context: any
) => {
  try {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
    }

    const user_id = context.user.id;

    const existing_prompt = await context.entities.ExerciseGeneratePrompt.findFirst({
      where: { user_id: user_id },
    });

    if (existing_prompt) {
      throw new HttpError(400, 'Prompt already exists');
    }

    const created_prompt = await context.entities.ExerciseGeneratePrompt.create({
      data: { user_id: user_id, pre_prompt: data.pre_prompt || '', post_prompt: data.post_prompt || '' },
    });

    return {
      success: true,
      message: 'Prompt created successfully',
      data: created_prompt,
    };
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to create prompt', { error: error.message });
  }
};

export const updatePrompt: UpdatePrompt<{ id: number; data: Partial<ExerciseGeneratePrompt> }, Response> = async (
  { id, data },
  context
) => {
  try {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
    }

    const user_id = context.user.id;

    const existing_prompt = await context.entities.ExerciseGeneratePrompt.findFirst({
      where: { user_id: user_id },
    });

    if (!existing_prompt) {
      const created_prompt = await context.entities.ExerciseGeneratePrompt.create({
        data: {
          user_id: user_id,
          pre_prompt: data.pre_prompt || '',
          post_prompt: data.post_prompt || '',
        },
      });

      return {
        success: true,
        message: 'Prompt created successfully',
        data: created_prompt,
      };
    } else {
      const updated_prompt = await context.entities.ExerciseGeneratePrompt.update({
        where: { id: existing_prompt.id },
        data: {
          pre_prompt: data.pre_prompt || '',
          post_prompt: data.post_prompt || '',
        },
      });

      return {
        success: true,
        message: 'Prompt updated successfully',
        data: updated_prompt,
      };
    }
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to update prompt', { error: error.message });
  }
};

export const deletePrompt: DeletePrompt<{ id: number }, Response> = async ({ id }: { id: number }, context: any) => {
  try {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
    }

    const user_id = context.user.id;

    const existing_prompt = await context.entities.ExerciseGeneratePrompt.findFirst({
      where: { user_id: user_id },
    });

    if (!existing_prompt) {
      throw new HttpError(400, 'Prompt not found');
    }

    await context.entities.ExerciseGeneratePrompt.delete({ where: { id: existing_prompt.id } });

    return {
      success: true,
      message: 'Prompt deleted successfully',
      data: null,
    };
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to delete prompt', { error: error.message });
  }
};
