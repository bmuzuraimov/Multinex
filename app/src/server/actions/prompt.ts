// updatePrompt.ts
import { ExerciseGeneratePrompt } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type UpdatePrompt } from 'wasp/server/operations';

export const updatePrompt: UpdatePrompt<{ id: number; data: Partial<ExerciseGeneratePrompt> }, ExerciseGeneratePrompt> =
  async ({ id, data }, context) => {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
    }

    // Upsert logic, or standard update if you prefer
    // If you want to be sure you're updating the correct user, check userId:
    const userId = context.user.id;

    // If the record doesn't exist yet, you might prefer an upsert:
    const existingPrompt = await context.entities.ExerciseGeneratePrompt.findFirst({
      where: { userId: userId },
    });

    if (!existingPrompt) {
      // Create new
      return context.entities.ExerciseGeneratePrompt.create({
        data: {
          userId: userId,
          pre_prompt: data.pre_prompt || '',
          post_prompt: data.post_prompt || '',
        },
      });
    } else {
      // Update existing
      return context.entities.ExerciseGeneratePrompt.update({
        where: { id: existingPrompt.id },
        data: { pre_prompt: data.pre_prompt || '',
                post_prompt: data.post_prompt || '' 
              },
      });
    }
  };
