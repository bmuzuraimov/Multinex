import { BaseEmailTemplate, TEXT_UTILS } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';

interface TeamSeatLimitParams {
  user_id: string;
  user_name: string;
  user_email: string;
  enterprise_plan_name: string;
  change_plan_link: string;
}

export class TeamSeatLimitEmail extends BaseEmailTemplate {
  constructor(private params: TeamSeatLimitParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Your Team Has Reached Its Seat Limit - Multinex';
  }

  protected generateText(): string {
    const { user_name, enterprise_plan_name, change_plan_link } = this.params;
    const bullet_points = [
      'Upgrade your plan for additional seats',
      'Remove inactive users to free up space',
      'Contact support for custom solutions'
    ];

    return `
Hi ${user_name},

Your ${enterprise_plan_name} has reached its maximum number of seats.
To add more users, consider upgrading your plan or managing your existing seats.

Here's what you can do:
${TEXT_UTILS.generateBulletPoints(bullet_points)}

Change your plan here: ${change_plan_link}

${TEXT_UTILS.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { user_name, enterprise_plan_name, change_plan_link } = this.params;
    const bullet_points = [
      'Upgrade your plan for additional seats',
      'Remove inactive users to free up space',
      'Contact support for custom solutions'
    ];

    return `
      ${components.heading('Your Team Has Reached Its Seat Limit')}
      ${components.paragraph(`Hi ${user_name},`)}
      ${components.paragraph(
        `Your <strong>${enterprise_plan_name}</strong> has reached its maximum number of seats. ` +
        'To add more users, consider upgrading your plan or managing your existing seats.'
      )}
      ${components.paragraph('Here\'s what you can do:')}
      ${components.bullet_list(bullet_points)}
      ${components.button('Change Plan', change_plan_link)}
      ${components.paragraph('Thanks for your time, and have a great day!')}
      ${components.paragraph('<strong>Multinex</strong>')}
    `;
  }
}