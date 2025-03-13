import { HttpError } from 'wasp/server';
import { type CreateFeedback } from 'wasp/server/operations';
import { emailSender } from 'wasp/server/email';
import { feedbackTemplate } from '../email-templates/feedback';
import { ApiResponse } from './types';
import { Feedback } from 'wasp/entities';

export const createFeedback: CreateFeedback<{
  message: string;
  rating: number;
  usability?: string;
  features?: string;
  improvements?: string;
  would_recommend: boolean;
  experience_level?: string;
  category: string;
  browser_info: string;
},
  ApiResponse<Feedback>
> = async (feedback, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const created_feedback = await context.entities.Feedback.create({
    data: {
      message: feedback.message,
      email: context.user.email ?? '',
      rating: feedback.rating,
      usability: feedback.usability,
      features: feedback.features,
      improvements: feedback.improvements,
      would_recommend: feedback.would_recommend,
      experience_level: feedback.experience_level,
      category: feedback.category,
      browser_info: feedback.browser_info,
      user: { connect: { id: context.user.id } },
    },
  });

  const feedback_email = await feedbackTemplate({
    message: created_feedback.message,
    email: created_feedback.email,
    rating: created_feedback.rating,
    usability: created_feedback.usability ?? undefined,
    features: created_feedback.features ?? undefined,
    improvements: created_feedback.improvements ?? undefined,
    would_recommend: created_feedback.would_recommend,
    experience_level: created_feedback.experience_level ?? undefined,
    category: created_feedback.category,
    browser_info: created_feedback.browser_info ?? '',
  });

  await emailSender.send({
    to: process.env.ADMIN_EMAILS!,
    subject: feedback_email.subject,
    text: feedback_email.text,
    html: feedback_email.html,
  });

  return {
    success: true,
    code: 200,
    message: 'Feedback created successfully',
    data: created_feedback,
  };
};
