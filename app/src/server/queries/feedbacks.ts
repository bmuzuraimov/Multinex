import { Feedback } from 'wasp/entities';
import { type GetFeedbackByUserId } from 'wasp/server/operations';

export const getFeedbackByUserId: GetFeedbackByUserId<void, Feedback | null> = async (
  _args,
  context
) => {
  if (!context.user) {
    throw new Error('User not authenticated');
  }

  return await context.entities.Feedback.findFirst({
    where: {
      user_id: context.user.id,
    },
    orderBy: { created_at: 'desc' },
  });
};
