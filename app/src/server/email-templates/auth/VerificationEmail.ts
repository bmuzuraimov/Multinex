import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';
import { textUtils } from '../components/EmailTemplateFactory';

interface VerificationEmailParams {
  verificationLink: string;
  userName: string;
}

export class VerificationEmail extends BaseEmailTemplate {
  constructor(private params: VerificationEmailParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Verify Your Email Address - Typit';
  }

  protected generateText(): string {
    const { userName, verificationLink } = this.params;
    return `
Hi ${userName},

Thank you for signing up with Typit! To complete your registration, please verify your email address by clicking the link below:

${verificationLink}

If you didn't create this account, you can ignore this email.

${textUtils.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { userName, verificationLink } = this.params;
    return `
      ${components.heading('Verify Your Email Address')}
      ${components.paragraph(`Hi ${userName},`)}
      ${components.paragraph(
        'Thank you for signing up with <strong>Typit</strong>! To complete your registration, ' +
        'please verify your email address by clicking the link below:'
      )}
      ${components.button('Click to Verify', verificationLink)}
      ${components.paragraph("If you didn't create this account, you can ignore this email.")}
      ${components.paragraph('Thanks for your time, and have a great day!')}
      ${components.paragraph('<strong>Typit</strong>')}
    `;
  }
} 