import { BaseEmailTemplate, HTML_UTILS } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';

interface WelcomeEmailParams {
  user_id: string;
  user_name: string; 
  user_email: string;
  login_link: string;
}

export class WelcomeEmail extends BaseEmailTemplate {
  constructor(private params: WelcomeEmailParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Welcome to Multinex – Get Started';
  }

  protected generateText(): string {
    const { user_name, login_link } = this.params;
    return `
Hi ${user_name},

Welcome to Multinex! We're excited to have you join us.

Multinex helps you learn through writing, typing, and listening—three proven ways to improve retention.

Get started:
• Explore different learning modes
• Try your first lesson
• Track your progress

Your account is ready: ${login_link}

Multinex
Type, write, listen. In one AI-powered workspace.`;
  }

  protected generateHtmlContent(): string {
    const { user_name, login_link } = this.params;

    const welcomeSection = HTML_UTILS.buildSection(`
      ${components.heading('Welcome to Multinex')}
      ${components.paragraph(`Hi ${user_name},`)}
      ${components.paragraph(
        `We're excited to have you join our learning platform. Multinex helps you master information through multiple learning modes.`
      )}
    `);

    const featuresSection = HTML_UTILS.buildSection(`
      ${components.highlight_card(`
        ${components.subheading('Your AI-powered learning workspace')}
        ${components.bullet_list([
          '<strong>Write</strong>: Reinforce knowledge through writing exercises',
          '<strong>Type</strong>: Improve recall with interactive typing drills',
          '<strong>Listen</strong>: Learn on the go with audio features'
        ])}
      `)}
    `);

    const callToActionSection = HTML_UTILS.buildSection(`
      ${components.paragraph('Your account is ready. Start exploring Multinex today:')}
      ${HTML_UTILS.createButtonRow([
        { text: 'Log In Now', link: login_link, variant: 'primary' },
        { text: 'Learn More', link: 'https://multinex.app/features', variant: 'secondary' }
      ])}
    `);

    return `
      ${welcomeSection}
      ${featuresSection}
      ${callToActionSection}
    `;
  }
}
