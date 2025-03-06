import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';
import { textUtils } from '../components/EmailTemplateFactory';

interface TeamSeatLimitParams {
  userId: string;
  userName: string;
  userEmail: string;
  enterprisePlanName: string;
  changePlanLink: string;
}

export class TeamSeatLimitEmail extends BaseEmailTemplate {
  constructor(private params: TeamSeatLimitParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Your Team Has Reached Its Seat Limit - Multinex';
  }

  protected generateText(): string {
    const { userName, enterprisePlanName, changePlanLink } = this.params;
    const bulletPoints = [
      'Upgrade your plan for additional seats',
      'Remove inactive users to free up space',
      'Contact support for custom solutions'
    ];

    return `
Hi ${userName},

Your ${enterprisePlanName} has reached its maximum number of seats.
To add more users, consider upgrading your plan or managing your existing seats.

Here's what you can do:
${textUtils.generateBulletPoints(bulletPoints)}

Change your plan here: ${changePlanLink}

${textUtils.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { userName, enterprisePlanName, changePlanLink } = this.params;
    const bulletPoints = [
      'Upgrade your plan for additional seats',
      'Remove inactive users to free up space',
      'Contact support for custom solutions'
    ];

    return `
      ${components.heading('Your Team Has Reached Its Seat Limit')}
      ${components.paragraph(`Hi ${userName},`)}
      ${components.paragraph(
        `Your <strong>${enterprisePlanName}</strong> has reached its maximum number of seats. ` +
        'To add more users, consider upgrading your plan or managing your existing seats.'
      )}
      ${components.paragraph('Here\'s what you can do:')}
      ${components.bulletList(bulletPoints)}
      ${components.button('Change Plan', changePlanLink)}
      ${components.paragraph('Thanks for your time, and have a great day!')}
      ${components.paragraph('<strong>Multinex</strong>')}
    `;
  }
} 