import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';
import { textUtils } from '../components/EmailTemplateFactory';

interface EnterpriseExpirationParams {
  userId: string;
  userName: string;
  userEmail: string;
  enterprisePlanName: string;
  expirationDate: string;
  renewLink: string;
  features: string[];
}

export class EnterpriseExpirationEmail extends BaseEmailTemplate {
  constructor(private params: EnterpriseExpirationParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Your Enterprise Plan is Expiring Soon! - Multinex';
  }

  protected generateText(): string {
    const { userName, enterprisePlanName, expirationDate, renewLink, features } = this.params;
    return `
Hi ${userName},

Your ${enterprisePlanName} is set to expire on ${expirationDate}. 
To ensure uninterrupted access to all features, please renew your subscription before this date.

Renew now to continue enjoying:
${textUtils.generateBulletPoints(features)}

Renew your subscription here: ${renewLink}

If you need assistance or have any questions, feel free to contact us.

${textUtils.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { userName, enterprisePlanName, expirationDate, renewLink, features } = this.params;
    return `
      ${components.heading('Your Enterprise Plan is Expiring Soon!')}
      ${components.paragraph(`Hi ${userName},`)}
      ${components.paragraph(
        `Your <strong>${enterprisePlanName}</strong> is set to expire on <strong>${expirationDate}</strong>. ` +
        'To ensure uninterrupted access to all features, please renew your subscription before this date.'
      )}
      ${components.paragraph('Renew now to continue enjoying:')}
      ${components.bulletList(features)}
      ${components.button('Renew Subscription', renewLink)}
      ${components.paragraph('If you need assistance or have any questions, feel free to contact us.')}
      ${components.paragraph('Thanks for your time, and have a great day!')}
      ${components.paragraph('<strong>Multinex</strong>')}
    `;
  }
} 