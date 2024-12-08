import { HttpError } from 'wasp/server';
import { type CreateFeedback } from 'wasp/server/operations';
import { emailSender } from 'wasp/server/email';
import feedbackTemplate from '../email-templates/feedback';

export const createFeedback: CreateFeedback<{
  message: string;
  rating: number;
  usability?: string;
  features?: string;
  improvements?: string;
  wouldRecommend: boolean;
  experienceLevel?: string;
  category: string;
  browserInfo: string;
}> = async (feedback, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const newFeedback = await context.entities.Feedback.create({
    data: {
      message: feedback.message,
      email: context.user.email ?? '',
      rating: feedback.rating,
      usability: feedback.usability,
      features: feedback.features,
      improvements: feedback.improvements,
      wouldRecommend: feedback.wouldRecommend,
      experienceLevel: feedback.experienceLevel,
      category: feedback.category,
      browserInfo: feedback.browserInfo,
      user: { connect: { id: context.user.id } },
    },
  });

  await emailSender.send({
    to: process.env.ADMIN_EMAILS!,
    subject: 'New Feedback from ' + context.user.email,
    text: feedback.message,
    html: feedbackTemplate(newFeedback),
  });

  return newFeedback;
};
