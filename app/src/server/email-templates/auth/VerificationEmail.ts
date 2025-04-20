import { BaseEmailTemplate, HTML_UTILS } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';

interface VerificationEmailParams {
  verification_link: string;
  user_name: string;
}

export class VerificationEmail extends BaseEmailTemplate {
  constructor(private params: VerificationEmailParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Verify Your Email - Multinex';
  }

  protected generateText(): string {
    const { user_name, verification_link } = this.params;
    return `
Hi ${user_name},

Please verify your email to activate your Multinex account.

Verify now: ${verification_link}

This link will expire in 24 hours. If you didn't create an account, please ignore this email.

Multinex
Type, write, listen. In one AI-powered workspace.`;
  }

  protected generateHtmlContent(): string {
    const { user_name, verification_link } = this.params;

    const headerSection = HTML_UTILS.buildSection(`
      ${components.heading('Verify Your Email')}
      ${components.paragraph(`Hi ${user_name},`)}
    `);

    const verificationSection = HTML_UTILS.buildSection(`
      ${components.highlight_card(`
        ${components.paragraph('Please verify your email address to activate your Multinex account:')}
        ${components.button('Verify Email', verification_link)}
        ${components.paragraph('<small>This link will expire in 24 hours.</small>')}
      `)}
    `);

    const securityNote = HTML_UTILS.buildSection(`
      ${components.paragraph("If you didn't create this account, you can safely ignore this email.")}
    `);

    return `
      ${headerSection}
      ${verificationSection}
      ${securityNote}
    `;
  }
}