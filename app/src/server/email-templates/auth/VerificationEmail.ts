import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';
import { TEXT_UTILS } from '../components/EmailTemplateFactory';

interface VerificationEmailParams {
  verification_link: string;
  user_name: string;
}

export class VerificationEmail extends BaseEmailTemplate {
  constructor(private params: VerificationEmailParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Verify Your Email Address - Multinex';
  }

  protected generateText(): string {
    const { user_name, verification_link } = this.params;
    return `
Hi ${user_name},

Thank you for signing up with Multinex! To complete your registration, please verify your email address by clicking the link below:

${verification_link}

If you didn't create this account, you can ignore this email.

${TEXT_UTILS.generateSignature()}`;
  }

  protected generateHtmlContent(): string {
    const { user_name, verification_link } = this.params;
    return `
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>${components.heading('Verify Your Email Address')}</tr>
        <tr>${components.paragraph(`Hi ${user_name},`)}</tr>
        <tr>${components.paragraph(
          'Thank you for signing up with <strong>Multinex</strong>! To complete your registration, ' +
          'please verify your email address by clicking the link below:'
        )}</tr>
        <tr>${components.button('Click to Verify', verification_link)}</tr>
        <tr>${components.paragraph("If you didn't create this account, you can ignore this email.")}</tr>
        <tr>${components.paragraph('Thanks for your time, and have a great day!')}</tr>
        <tr>${components.paragraph('<strong>Multinex</strong>')}</tr>
      </table>
    `;
  }
}