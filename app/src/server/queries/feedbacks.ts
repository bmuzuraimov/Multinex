import { Feedback } from 'wasp/entities';
import { type GetFeedbackByUserId } from 'wasp/server/operations';

export const getFeedbackByUserId: GetFeedbackByUserId<{ userId: string }, Feedback | null> = async (
  { userId },
  context
) => {
  if (!context.user) {
    throw new Error('User not authenticated');
  }

  return await context.entities.Feedback.findFirst({
    where: {
      userId: context.user.id,
    },
    orderBy: { createdAt: 'desc' },
  });
};
