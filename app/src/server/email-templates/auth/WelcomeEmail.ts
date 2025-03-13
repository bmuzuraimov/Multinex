import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
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
    return 'Welcome to Multinex – A Smarter Way to Learn!';
  }

  protected generateText(): string {
    const { user_name, login_link } = this.params;
    return `
Hi ${user_name},

Welcome to Multinex! 🎉 We're so excited to have you on board.

Multinex is designed to help you learn and understand information better through writing, typing, and listening—three proven ways to improve retention and comprehension. Whether you're preparing for exams, mastering new subjects, or just sharpening your skills, we're here to support your learning journey.

Here's how to get started:
• Explore different learning modes – writing, typing, and listening
• Try your first lesson and see what works best for you
• Save progress and track improvements

If you have any questions, feel free to reach out—we're happy to help!

Start now: ${login_link}

Thanks for being part of Multinex!

Thanks for your time, and have a great day!

Multinex

Type, write, listen. In one AI-powered workspace.`;
  }

  protected generateHtmlContent(): string {
    const { user_name, login_link } = this.params;

    const welcome_card = `
      <tr>${components.paragraph(`Hi ${user_name},`)}</tr>
      <tr>${components.paragraph(
        `Welcome to <strong>Multinex</strong>! <span style="font-size: 18px;">🎉</span> We're so excited to have you on board.`
      )}</tr>
      <tr>${components.paragraph(
        `<strong>Multinex</strong> is designed to help you learn and understand information better through ` +
          'writing, typing, and listening—three proven ways to improve retention and comprehension. ' +
          "Whether you're preparing for exams, mastering new subjects, or just sharpening your skills, " +
          "we're here to support your learning journey."
      )}</tr>
    `;

    const get_started_card = `
      <tr>${components.subheading("Here's how to get started:")}</tr>
      <tr>${components.bullet_list([
        'Explore different learning modes – writing, typing, and listening',
        'Try your first lesson and see what works best for you',
        'Save progress and track improvements',
      ])}</tr>
    `;

    const support_card = `
      <tr>${components.paragraph("If you have any questions, feel free to reach out—we're happy to help!")}</tr>
      <tr>${components.button('Start Now', login_link)}</tr>
      <tr>${components.paragraph('Thanks for being part of <strong>Multinex</strong>!')}</tr>
      <tr>${components.paragraph('Thanks for your time, and have a great day!')}</tr>
      <tr>${components.paragraph('<strong>Multinex</strong>')}</tr>
    `;

    return `
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>${components.heading('Welcome to <strong>Multinex</strong> – A Smarter Way to Learn!')}</tr>
        <tr>${welcome_card}</tr>
        <tr>${get_started_card}</tr>
        <tr>${support_card}</tr>
      </table>
    `;
  }
}
