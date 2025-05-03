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
    return 'Your Multinex journey begins now';
  }

  protected generateText(): string {
    const { user_name, login_link } = this.params;
    return `
Hi ${user_name},

Your brain is about to thank you.

Multinex activates multiple neural pathways through writing, typing, and listening—unlocking your natural learning potential.

Your workspace is ready: ${login_link}

Learn differently,
The Multinex Team`;
  }

  protected generateHtmlContent(): string {
    const { user_name, login_link } = this.params;

    const welcomeSection = HTML_UTILS.buildSection(`
      ${components.heading('Welcome to Multinex')}
      ${components.paragraph(`Hi ${user_name},`)}
      ${components.paragraph(`Your brain is about to thank you.`)}
    `);

    const featuresSection = HTML_UTILS.buildSection(`
      ${components.highlight_card(`
        ${components.subheading('Engage Multiple Neural Pathways')}
        ${components.bullet_list([
          '<strong>Write</strong> to encode',
          '<strong>Type</strong> to retrieve',
          '<strong>Listen</strong> to reinforce',
        ])}
      `)}
    `);

    const callToActionSection = HTML_UTILS.buildSection(`
      ${components.paragraph('Your neuroscience-backed workspace is ready:')}
      ${HTML_UTILS.createButtonRow([
        { text: 'Begin Learning', link: login_link, variant: 'primary' },
        { text: 'Explore Features', link: 'https://multinex.app', variant: 'secondary' },
      ])}
    `);

    return `
      ${welcomeSection}
      ${featuresSection}
      ${callToActionSection}
    `;
  }
}
