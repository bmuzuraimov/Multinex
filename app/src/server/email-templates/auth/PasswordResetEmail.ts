import { BaseEmailTemplate, TEXT_UTILS, HTML_UTILS } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';

interface PasswordResetEmailParams {
  password_reset_link: string;
  user_name: string; 
}

export class PasswordResetEmail extends BaseEmailTemplate {
  constructor(private params: PasswordResetEmailParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Reset Your Multinex Password';
  }

  protected generateText(): string {
    const { user_name, password_reset_link } = this.params;
    return `
Hi ${user_name},

We received a request to reset your Multinex password. 

Reset your password: ${password_reset_link}

This link will expire in 24 hours. If you didn't request this reset, please ignore this email.

Multinex
Type, write, listen. In one AI-powered workspace.`;
  }

  protected generateHtmlContent(): string {
    const { user_name, password_reset_link } = this.params;

    const mainSection = HTML_UTILS.buildSection(`
      ${components.heading('Reset Your Password')}
      ${components.paragraph(`Hi ${user_name},`)}
      ${components.paragraph('We received a request to reset your Multinex password.')}
    `);

    const securitySection = HTML_UTILS.buildSection(`
      ${components.card(`
        ${components.paragraph('Please click the button below to reset your password:')}
        ${components.button('Reset Password', password_reset_link)}
        ${components.paragraph('<small>This link will expire in 24 hours. If you didn\'t request this reset, please ignore this email.</small>')}
      `)}
    `);

    const helpSection = HTML_UTILS.buildSection(`
      ${components.paragraph('Need help? Contact our <a href="https://multinex.app/support" style="color: #3182CE; text-decoration: none;">support team</a>.')}
    `);

    return `
      ${mainSection}
      ${securitySection}
      ${helpSection}
    `;
  }
}