import { Feedback } from 'wasp/entities';
import { emailSender } from 'wasp/server/email';
import { HttpError } from 'wasp/server';
import { feedbackTemplate } from '../email-templates/feedback';
import { type CreateFeedback, type UpdateFeedback, type DeleteFeedback } from 'wasp/server/operations';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const createFeedback: CreateFeedback<Partial<Feedback>, Response> = async (
  feedbackData: Partial<Feedback>,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const { html, text } = feedbackTemplate({
      message: feedbackData.message || '',
      email: feedbackData.email || '',
      rating: feedbackData.rating || 0,
      usability: feedbackData.usability || undefined,
      features: feedbackData.features || undefined,
      improvements: feedbackData.improvements || undefined,
      would_recommend: feedbackData.would_recommend || false,
      experience_level: feedbackData.experience_level || undefined,
      browser_info: feedbackData.browser_info || '',
      category: feedbackData.category || '',
    });
    await emailSender.send({
      to: 'bmuzuraimov@gmail.com',
      subject: 'New Feedback from ' + feedbackData.email,
      html,
      text,
    });
    const feedback = await context.entities.Feedback.create({
      data: { ...feedbackData, user_id: context.user.id },
    });
    return {
      success: true,
      message: 'Feedback created successfully',
      data: feedback,
    };
  } catch (error: any) {
    throw new HttpError(500, 'Failed to create feedback', { error: error.message });
  }
};

export const updateFeedback: UpdateFeedback<Partial<Feedback>, Response> = async (
  feedbackData: Partial<Feedback>,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const feedback = await context.entities.Feedback.update({
      where: { id: feedbackData.id, user_id: context.user.id },
      data: feedbackData,
    });
    return {
      success: true,
      message: 'Feedback updated successfully',
      data: feedback,
    };
  } catch (error: any) {
    throw new HttpError(500, 'Failed to update feedback', { error: error.message });
  }
};

export const deleteFeedback: DeleteFeedback<Partial<Feedback>, Response> = async (
  feedbackData: Partial<Feedback>,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const feedback = await context.entities.Feedback.delete({
      where: { id: feedbackData.id, user_id: context.user.id },
    });
    return {
      success: true,
      message: 'Feedback deleted successfully',
      data: feedback,
    };
  } catch (error: any) {
    throw new HttpError(500, 'Failed to delete feedback', { error: error.message });
  }
};
