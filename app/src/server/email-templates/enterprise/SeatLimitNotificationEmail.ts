import { BaseEmailTemplate, TEXT_UTILS } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';

interface SeatLimitNotificationParams {
  user_id: string;
  user_name: string;
  user_email: string;
  enterprise_plan_name: string;
  account_link: string;
  current_seats: number;
  max_seats: number;
}

export class SeatLimitNotificationEmail extends BaseEmailTemplate {
  constructor(private params: SeatLimitNotificationParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Seat Limit Reached - Multinex Enterprise';
  }

  protected generateText(): string {
    const { user_name, enterprise_plan_name, current_seats, max_seats, account_link } = this.params;
    const bullet_points = [
      'Upgrade your plan for additional seats',
      'Remove inactive users to free up space', 
      'Contact support for custom solutions'
    ];

    return `
Hi ${user_name},

Your ${enterprise_plan_name} has reached its maximum number of seats (${current_seats}/${max_seats}).
To add more users, consider upgrading your plan or managing your existing seats.

Here's what you can do:
${TEXT_UTILS.generateBulletPoints(bullet_points)}

Check your account here: ${account_link}

${TEXT_UTILS.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { user_name, enterprise_plan_name, current_seats, max_seats, account_link } = this.params;
    const bullet_points = [
      'Upgrade your plan for additional seats',
      'Remove inactive users to free up space',
      'Contact support for custom solutions'
    ];

    return `
      ${components.heading('Seat Limit Reached')}
      ${components.paragraph(`Hi ${user_name},`)}
      ${components.paragraph(
        `Your <strong>${enterprise_plan_name}</strong> has reached its maximum number of seats (${current_seats}/${max_seats}). ` +
        'To add more users, consider upgrading your plan or managing your existing seats.'
      )}
      ${components.paragraph('Here\'s what you can do:')}
      ${components.bullet_list(bullet_points)}
      ${components.button('Check Account', account_link)}
      ${components.paragraph('Thanks for your time, and have a great day!')}
      ${components.paragraph('<strong>Multinex</strong>')}
    `;
  }
}