import { HttpError } from 'wasp/server'
import { type GetPrompt } from 'wasp/server/operations'
import { type ExerciseGeneratePrompt } from 'wasp/entities'

export const getPrompt: GetPrompt<void, ExerciseGeneratePrompt> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized')
  }

  // userId is a string in your new model
  const userId = context.user.id

  // Fetch the user's existing record
  const prompt = await context.entities.ExerciseGeneratePrompt.findFirst({
    where: { userId },
  })

  // Return if found, or a default "empty" row
  return prompt || {
    id: 0,
    userId,
    pre_prompt: '',
    post_prompt: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
