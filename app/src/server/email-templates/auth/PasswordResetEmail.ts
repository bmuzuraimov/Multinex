import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';
import { textUtils } from '../components/EmailTemplateFactory';

interface PasswordResetEmailParams {
  passwordResetLink: string;
  userName: string;
}

export class PasswordResetEmail extends BaseEmailTemplate {
  constructor(private params: PasswordResetEmailParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Reset Your Password - Multinex';
  }

  protected generateText(): string {
    const { userName, passwordResetLink } = this.params;
    return `
Hi ${userName},

We received a request to reset your password for your Multinex account. If this was you, please verify your password by clicking the link below. If you didn't request a password reset, you can ignore this email.

${passwordResetLink}

${textUtils.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { userName, passwordResetLink } = this.params;
    return `
      ${components.heading('Reset Your Password')}
      ${components.paragraph(`Hi ${userName},`)}
      ${components.paragraph(
        'We received a request to reset your password for your <strong>Multinex</strong> account. ' +
        'If this was you, please verify your password by clicking the button below. ' +
        'If you didn\'t request a password reset, you can ignore this email.'
      )}
      ${components.button('Reset Password', passwordResetLink)}
      ${components.paragraph('Thanks for your time, and have a great day!')}
      ${components.paragraph('<strong>Multinex</strong>')}
    `;
  }
} 