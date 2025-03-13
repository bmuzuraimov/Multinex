import { EmailTemplate, generateBaseLayout } from './BaseTemplate';

// Base class for all email templates
export abstract class BaseEmailTemplate implements EmailTemplate {
  protected abstract generateSubject(): string;
  protected abstract generateText(): string;
  protected abstract generateHtmlContent(): string;

  get subject(): string {
    return this.generateSubject();
  }

  get text(): string {
    return this.generateText(); 
  }

  get html(): string {
    return generateBaseLayout(this.generateHtmlContent(), this.subject);
  }
}

// Factory for creating email templates
export class EmailTemplateFactory {
  static createTemplate<T extends BaseEmailTemplate>(
    template_class: new (...args: any[]) => T,
    ...args: any[]
  ): EmailTemplate {
    const template_instance = new template_class(...args);
    return {
      subject: template_instance.subject,
      text: template_instance.text,
      html: template_instance.html
    };
  }
}

// Common text generation utilities
export const TEXT_UTILS = {
  generateSignature: () => `
Thanks for your time, and have a great day!

Multinex

Type, write, listen. In one AI-powered workspace.`,

  generateBulletPoints: (items: string[]): string => 
    items.map(item => `• ${item}`).join('\n'),
};