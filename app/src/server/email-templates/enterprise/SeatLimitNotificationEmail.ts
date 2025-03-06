import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';
import { textUtils } from '../components/EmailTemplateFactory';

interface SeatLimitNotificationParams {
  userId: string;
  userName: string;
  userEmail: string;
  enterprisePlanName: string;
  accountLink: string;
  currentSeats: number;
  maxSeats: number;
}

export class SeatLimitNotificationEmail extends BaseEmailTemplate {
  constructor(private params: SeatLimitNotificationParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Seat Limit Reached - Multinex Enterprise';
  }

  protected generateText(): string {
    const { userName, enterprisePlanName, currentSeats, maxSeats, accountLink } = this.params;
    const bulletPoints = [
      'Upgrade your plan for additional seats',
      'Remove inactive users to free up space',
      'Contact support for custom solutions'
    ];

    return `
Hi ${userName},

Your ${enterprisePlanName} has reached its maximum number of seats (${currentSeats}/${maxSeats}).
To add more users, consider upgrading your plan or managing your existing seats.

Here's what you can do:
${textUtils.generateBulletPoints(bulletPoints)}

Check your account here: ${accountLink}

${textUtils.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { userName, enterprisePlanName, currentSeats, maxSeats, accountLink } = this.params;
    const bulletPoints = [
      'Upgrade your plan for additional seats',
      'Remove inactive users to free up space',
      'Contact support for custom solutions'
    ];

    return `
      ${components.heading('Seat Limit Reached')}
      ${components.paragraph(`Hi ${userName},`)}
      ${components.paragraph(
        `Your <strong>${enterprisePlanName}</strong> has reached its maximum number of seats (${currentSeats}/${maxSeats}). ` +
        'To add more users, consider upgrading your plan or managing your existing seats.'
      )}
      ${components.paragraph('Here\'s what you can do:')}
      ${components.bulletList(bulletPoints)}
      ${components.button('Check Account', accountLink)}
      ${components.paragraph('Thanks for your time, and have a great day!')}
      ${components.paragraph('<strong>Multinex</strong>')}
    `;
  }
} 