import { BaseEmailTemplate, TEXT_UTILS } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';

interface FeatureTrialFeedbackParams {
  user_id: string;
  user_name: string;
  user_email: string;
  feature_name: string;
  feedback_link: string;
}

export class FeatureTrialFeedbackEmail extends BaseEmailTemplate {
  constructor(private params: FeatureTrialFeedbackParams) {
    super();
  }

  protected generateSubject(): string {
    const { feature_name } = this.params;
    return `How Was Your Experience with ${feature_name}?`;
  }

  protected generateText(): string {
    const { user_name, feature_name, feedback_link } = this.params;
    return `
Hi ${user_name},

We noticed you recently tried out ${feature_name}! We'd love to listen your thoughts—your feedback helps us improve.

Did it work as expected? Anything we can do better? Let us know by sharing your feedback.

Share your feedback here: ${feedback_link}

Thanks for being part of Multinex!

${TEXT_UTILS.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { user_name, feature_name, feedback_link } = this.params;
    return `
      ${components.heading(`How Was Your Experience with ${feature_name}?`)}
      ${components.paragraph(`Hi ${user_name},`)}
      ${components.paragraph(
        `We noticed you recently tried out <strong>${feature_name}</strong>! We'd love to listen ` +
        'your thoughts—your feedback helps us improve.'
      )}
      ${components.paragraph(
        'Did it work as expected? Anything we can do better? Let us know by sharing your feedback.'
      )}
      ${components.button('Send Feedback', feedback_link)}
      ${components.paragraph('Thanks for being part of <strong>Multinex</strong>!')}
      ${components.paragraph('Thanks for your time, and have a great day!')}
      ${components.paragraph('<strong>Multinex</strong>')}
    `;
  }
}