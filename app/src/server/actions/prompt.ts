import { ExerciseGeneratePrompt } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type UpdatePrompt } from 'wasp/server/operations';
import { ApiResponse } from './types';

export const updatePrompt: UpdatePrompt<
  { id: number; data: Partial<ExerciseGeneratePrompt> },
  ApiResponse<ExerciseGeneratePrompt>
> = async ({ id, data }, context) => {
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
      code: 200,
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
      code: 200,
      message: 'Prompt updated successfully',
      data: updated_prompt,
    };
  }
};
