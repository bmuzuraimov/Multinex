import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components, styles, styleToString } from '../components/BaseTemplate';

interface WelcomeEmailParams {
  userId: string;
  userName: string;
  userEmail: string;
  loginLink: string;
}

export class WelcomeEmail extends BaseEmailTemplate {
  constructor(private params: WelcomeEmailParams) {
    super();
  }

  protected generateSubject(): string {
    return 'Welcome to Multinex – A Smarter Way to Learn!';
  }

  protected generateText(): string {
    const { userName, loginLink } = this.params;
    return `
Hi ${userName},

Welcome to Multinex! 🎉 We're so excited to have you on board.

Multinex is designed to help you learn and understand information better through writing, typing, and listening—three proven ways to improve retention and comprehension. Whether you're preparing for exams, mastering new subjects, or just sharpening your skills, we're here to support your learning journey.

Here's how to get started:
• Explore different learning modes – writing, typing, and listening
• Try your first lesson and see what works best for you
• Save progress and track improvements

If you have any questions, feel free to reach out—we're happy to help!

Start now: ${loginLink}

Thanks for being part of Multinex!

Thanks for your time, and have a great day!

Multinex

Type, write, listen. In one AI-powered workspace.`;
  }

  protected generateHtmlContent(): string {
    const { userName, loginLink } = this.params;

    const welcomeCard = components.card(`
      ${components.paragraph(`Hi ${userName},`)}
      ${components.paragraph(`Welcome to <strong>Multinex</strong>! <span style="font-size: 18px;">🎉</span> We're so excited to have you on board.`)}
      ${components.paragraph(
        `<strong>Multinex</strong> is designed to help you learn and understand information better through ` +
        'writing, typing, and listening—three proven ways to improve retention and comprehension. ' +
        'Whether you\'re preparing for exams, mastering new subjects, or just sharpening your skills, ' +
        'we\'re here to support your learning journey.'
      )}
    `);

    const getStartedCard = components.card(`
      ${components.subheading('Here\'s how to get started:')}
      ${components.bulletList([
        'Explore different learning modes – writing, typing, and listening',
        'Try your first lesson and see what works best for you',
        'Save progress and track improvements'
      ])}
    `);

    const supportCard = components.card(`
      ${components.paragraph('If you have any questions, feel free to reach out—we\'re happy to help!')}
      ${components.button('Start Now', loginLink)}
      ${components.paragraph('Thanks for being part of <strong>Multinex</strong>!')}
      ${components.paragraph('Thanks for your time, and have a great day!')}
      ${components.paragraph('<strong>Multinex</strong>')}
    `);

    return `
      ${components.heading('Welcome to <strong>Multinex</strong> – A Smarter Way to Learn!')}
      ${welcomeCard}
      ${getStartedCard}
      ${supportCard}
    `;
  }
} 