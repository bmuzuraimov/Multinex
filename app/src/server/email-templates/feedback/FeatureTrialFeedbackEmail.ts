import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';
import { textUtils } from '../components/EmailTemplateFactory';

interface FeatureTrialFeedbackParams {
  userId: string;
  userName: string;
  userEmail: string;
  featureName: string;
  feedbackLink: string;
}

export class FeatureTrialFeedbackEmail extends BaseEmailTemplate {
  constructor(private params: FeatureTrialFeedbackParams) {
    super();
  }

  protected generateSubject(): string {
    const { featureName } = this.params;
    return `How Was Your Experience with ${featureName}?`;
  }

  protected generateText(): string {
    const { userName, featureName, feedbackLink } = this.params;
    return `
Hi ${userName},

We noticed you recently tried out ${featureName}! We'd love to listen your thoughts—your feedback helps us improve.

Did it work as expected? Anything we can do better? Let us know by sharing your feedback.

Share your feedback here: ${feedbackLink}

Thanks for being part of Typit!

${textUtils.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { userName, featureName, feedbackLink } = this.params;
    return `
      ${components.heading(`How Was Your Experience with ${featureName}?`)}
      ${components.paragraph(`Hi ${userName},`)}
      ${components.paragraph(
        `We noticed you recently tried out <strong>${featureName}</strong>! We'd love to listen ` +
        'your thoughts—your feedback helps us improve.'
      )}
      ${components.paragraph(
        'Did it work as expected? Anything we can do better? Let us know by sharing your feedback.'
      )}
      ${components.button('Send Feedback', feedbackLink)}
      ${components.paragraph('Thanks for being part of <strong>Typit</strong>!')}
      ${components.paragraph('Thanks for your time, and have a great day!')}
      ${components.paragraph('<strong>Typit</strong>')}
    `;
  }
}