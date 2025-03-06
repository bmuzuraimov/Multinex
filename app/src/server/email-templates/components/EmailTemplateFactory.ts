import { EmailTemplate, baseLayout, components } from './BaseTemplate';

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
    return baseLayout(this.generateHtmlContent(), this.subject);
  }
}

// Factory for creating email templates
export class EmailTemplateFactory {
  static createTemplate<T extends BaseEmailTemplate>(
    templateClass: new (...args: any[]) => T,
    ...args: any[]
  ): EmailTemplate {
    const template = new templateClass(...args);
    return {
      subject: template.subject,
      text: template.text,
      html: template.html
    };
  }
}

// Common text generation utilities
export const textUtils = {
  generateSignature: () => `
Thanks for your time, and have a great day!

Multinex

Type, write, listen. In one AI-powered workspace.`,

  generateBulletPoints: (items: string[]): string => 
    items.map(item => `• ${item}`).join('\n'),
}; 