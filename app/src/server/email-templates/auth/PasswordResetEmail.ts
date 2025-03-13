import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';
import { TEXT_UTILS } from '../components/EmailTemplateFactory';

interface PasswordResetEmailParams {
  password_reset_link: string;
  user_name: string; 
}

export class PasswordResetEmail extends BaseEmailTemplate {
  constructor(private params: PasswordResetEmailParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Reset Your Password - Multinex';
  }

  protected generateText(): string {
    const { user_name, password_reset_link } = this.params;
    return `
Hi ${user_name},

We received a request to reset your password for your Multinex account. If this was you, please verify your password by clicking the link below. If you didn't request a password reset, you can ignore this email.

${password_reset_link}

${TEXT_UTILS.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { user_name, password_reset_link } = this.params;
    return `
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>${components.heading('Reset Your Password')}</tr>
        <tr>${components.paragraph(`Hi ${user_name},`)}</tr>
        <tr>${components.paragraph(
          'We received a request to reset your password for your <strong>Multinex</strong> account. ' +
          'If this was you, please verify your password by clicking the button below. ' +
          'If you didn\'t request a password reset, you can ignore this email.'
        )}</tr>
        <tr>${components.button('Reset Password', password_reset_link)}</tr>
        <tr>${components.paragraph('Thanks for your time, and have a great day!')}</tr>
        <tr>${components.paragraph('<strong>Multinex</strong>')}</tr>
      </table>
    `;
  }
}