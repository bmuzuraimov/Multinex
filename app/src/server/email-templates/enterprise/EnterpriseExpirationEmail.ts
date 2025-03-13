import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';
import { TEXT_UTILS } from '../components/EmailTemplateFactory';

interface EnterpriseExpirationParams {
  user_id: string;
  user_name: string; 
  user_email: string;
  enterprise_plan_name: string;
  expiration_date: string;
  renew_link: string;
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
    const { user_name, enterprise_plan_name, expiration_date, renew_link, features } = this.params;
    return `
Hi ${user_name},

Your ${enterprise_plan_name} is set to expire on ${expiration_date}. 
To ensure uninterrupted access to all features, please renew your subscription before this date.

Renew now to continue enjoying:
${TEXT_UTILS.generateBulletPoints(features)}

Renew your subscription here: ${renew_link}

If you need assistance or have any questions, feel free to contact us.

${TEXT_UTILS.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { user_name, enterprise_plan_name, expiration_date, renew_link, features } = this.params;
    return `
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>${components.heading('Your Enterprise Plan is Expiring Soon!')}</tr>
        <tr>${components.paragraph(`Hi ${user_name},`)}</tr>
        <tr>${components.paragraph(
          `Your <strong>${enterprise_plan_name}</strong> is set to expire on <strong>${expiration_date}</strong>. ` +
          'To ensure uninterrupted access to all features, please renew your subscription before this date.'
        )}</tr>
        <tr>${components.paragraph('Renew now to continue enjoying:')}</tr>
        <tr>${components.bullet_list(features)}</tr>
        <tr>${components.button('Renew Subscription', renew_link)}</tr>
        <tr>${components.paragraph('If you need assistance or have any questions, feel free to contact us.')}</tr>
        <tr>${components.paragraph('Thanks for your time, and have a great day!')}</tr>
        <tr>${components.paragraph('<strong>Multinex</strong>')}</tr>
      </table>
    `;
  }
}