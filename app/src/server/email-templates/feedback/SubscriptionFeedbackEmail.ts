import { BaseEmailTemplate, TEXT_UTILS } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';

interface SubscriptionFeedbackParams {
  user_id: string;
  user_name: string;
  user_email: string;
  enterprise_plan_name: string;
  feedback_link: string;
}

export class SubscriptionFeedbackEmail extends BaseEmailTemplate {
  constructor(private params: SubscriptionFeedbackParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Tell Us About Your Experience with Multinex';
  }

  protected generateText(): string {
    const { user_name, enterprise_plan_name, feedback_link } = this.params;
    return `
Hi ${user_name},

Your ${enterprise_plan_name} subscription has ended, and we'd love to listen your thoughts! Your feedback helps us improve and create a better experience for you and your team.

Did the plan meet your needs? Is there anything we can do better? Let us know by sharing your feedback—it only takes a minute!

Share your feedback here: ${feedback_link}

Thanks for being part of Multinex!

${TEXT_UTILS.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { user_name, enterprise_plan_name, feedback_link } = this.params;
    return `
      ${components.heading('Tell Us About Your Experience with Multinex')}
      ${components.paragraph(`Hi ${user_name},`)}
      ${components.paragraph(
        `Your <strong>${enterprise_plan_name}</strong> subscription has ended, and we'd love to listen ` +
        'your thoughts! Your feedback helps us improve and create a better experience for you ' +
        'and your team.'
      )}
      ${components.paragraph(
        'Did the plan meet your needs? Is there anything we can do better? Let us know by ' +
        'sharing your feedback—it only takes a minute!'
      )}
      ${components.button('Send Feedback', feedback_link)}
      ${components.paragraph('Thanks for being part of <strong>Multinex</strong>!')}
      ${components.paragraph('Thanks for your time, and have a great day!')}
      ${components.paragraph('<strong>Multinex</strong>')}
    `;
  }
}