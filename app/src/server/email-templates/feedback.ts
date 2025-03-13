import { EmailTemplateFactory } from './components/EmailTemplateFactory';
import { SubscriptionFeedbackEmail } from './feedback/SubscriptionFeedbackEmail';
import { FeatureTrialFeedbackEmail } from './feedback/FeatureTrialFeedbackEmail';
import { GeneralFeedbackEmail } from './feedback/GeneralFeedbackEmail';

interface FeedbackRequestParams {
  userId: string;
  userName: string;
  userEmail: string;
  enterprisePlanName: string;
  feedbackLink: string;
}

export const subscriptionFeedbackEmail = (params: FeedbackRequestParams) => 
  EmailTemplateFactory.createTemplate(SubscriptionFeedbackEmail, params);

interface FeatureFeedbackParams {
  userId: string;
  userName: string;
  userEmail: string;
  featureName: string;
  feedbackLink: string;
}

export const featureTrialFeedbackEmail = (params: FeatureFeedbackParams) =>
  EmailTemplateFactory.createTemplate(FeatureTrialFeedbackEmail, params);

interface GeneralFeedbackParams {
  message: string;
  email: string;
  rating: number;
  usability?: string;
  features?: string;
  improvements?: string;
  would_recommend: boolean;
  experience_level?: string;
  category: string;
  browser_info: string;
}

export const feedbackTemplate = (params: GeneralFeedbackParams) =>
  EmailTemplateFactory.createTemplate(GeneralFeedbackEmail, params);
