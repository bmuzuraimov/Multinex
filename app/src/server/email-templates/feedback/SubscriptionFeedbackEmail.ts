import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';
import { textUtils } from '../components/EmailTemplateFactory';

interface SubscriptionFeedbackParams {
  userId: string;
  userName: string;
  userEmail: string;
  enterprisePlanName: string;
  feedbackLink: string;
}

export class SubscriptionFeedbackEmail extends BaseEmailTemplate {
  constructor(private params: SubscriptionFeedbackParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Tell Us About Your Experience with Typit';
  }

  protected generateText(): string {
    const { userName, enterprisePlanName, feedbackLink } = this.params;
    return `
Hi ${userName},

Your ${enterprisePlanName} subscription has ended, and we'd love to listen your thoughts! Your feedback helps us improve and create a better experience for you and your team.

Did the plan meet your needs? Is there anything we can do better? Let us know by sharing your feedback—it only takes a minute!

Share your feedback here: ${feedbackLink}

Thanks for being part of Typit!

${textUtils.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { userName, enterprisePlanName, feedbackLink } = this.params;
    return `
      ${components.heading('Tell Us About Your Experience with Typit')}
      ${components.paragraph(`Hi ${userName},`)}
      ${components.paragraph(
        `Your <strong>${enterprisePlanName}</strong> subscription has ended, and we'd love to listen ` +
        'your thoughts! Your feedback helps us improve and create a better experience for you ' +
        'and your team.'
      )}
      ${components.paragraph(
        'Did the plan meet your needs? Is there anything we can do better? Let us know by ' +
        'sharing your feedback—it only takes a minute!'
      )}
      ${components.button('Send Feedback', feedbackLink)}
      ${components.paragraph('Thanks for being part of <strong>Typit</strong>!')}
      ${components.paragraph('Thanks for your time, and have a great day!')}
      ${components.paragraph('<strong>Typit</strong>')}
    `;
  }
} 