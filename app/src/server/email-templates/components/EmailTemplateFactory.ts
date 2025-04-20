import { EmailTemplate, generateBaseLayout, components } from './BaseTemplate';

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

// Enhanced text and HTML generation utilities
export const TEXT_UTILS = {
  generateSignature: () => `
Thanks for your time, and have a great day!

Multinex

Type, write, listen. In one AI-powered workspace.`,

  generateBulletPoints: (items: string[]): string => 
    items.map(item => `• ${item}`).join('\n'),
    
  formatDate: (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  },
  
  formatDateTime: (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    }).format(date);
  },
  
  formatCurrency: (amount: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  }
};

// HTML component utilities for easier email template composition
export const HTML_UTILS = {
  // Wraps a series of components with proper table structure
  buildSection: (content: string): string => `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-bottom: 24px;">
      <tr>
        <td>
          ${content}
        </td>
      </tr>
    </table>
  `,
  
  // Creates a two-column layout
  createTwoColumns: (leftContent: string, rightContent: string, leftWidth = '50%'): string => `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
      <tr>
        <td width="${leftWidth}" valign="top" style="padding-right: 16px;">
          ${leftContent}
        </td>
        <td valign="top">
          ${rightContent}
        </td>
      </tr>
    </table>
  `,
  
  // Creates a button row with multiple buttons
  createButtonRow: (buttons: Array<{text: string, link: string, variant?: 'primary' | 'secondary'}>): string => {
    if (!buttons || buttons.length === 0) return '';
    
    return `
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
          ${buttons.map((btn, index) => `
            <td align="center" style="padding: ${index > 0 ? '0 0 0 12px' : '0'};">
              <a href="${btn.link}" target="_blank" style="${btn.variant === 'secondary' ? 
                'display:inline-block;background-color:#ffffff;color:#3182CE;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;border:1px solid #3182CE' : 
                'display:inline-block;background:linear-gradient(135deg,#3182CE 0%,#63B3ED 100%);color:#ffffff;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;border:none'}">
                ${btn.text}
              </a>
            </td>
          `).join('')}
        </tr>
      </table>
    `;
  },
  
  // Creates a key-value metadata display
  createMetadata: (items: Array<{key: string, value: string}>): string => {
    if (!items || items.length === 0) return '';
    
    return `
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border:1px solid #E2E8F0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
        ${items.map((item, index) => `
          <tr style="background-color:${index % 2 === 0 ? '#F7FAFC' : '#FFFFFF'}">
            <td style="padding:12px 16px;font-weight:600;width:40%;border-bottom:${index < items.length - 1 ? '1px solid #E2E8F0' : 'none'}">${item.key}</td>
            <td style="padding:12px 16px;border-bottom:${index < items.length - 1 ? '1px solid #E2E8F0' : 'none'}">${item.value}</td>
          </tr>
        `).join('')}
      </table>
    `;
  },
  
  // Creates a notification badge
  createBadge: (text: string, type: 'success' | 'warning' | 'error' | 'info' = 'info'): string => {
    const colors = {
      success: { bg: '#F0FFF4', text: '#38A169' },
      warning: { bg: '#FFFAF0', text: '#DD6B20' },
      error: { bg: '#FFF5F5', text: '#E53E3E' },
      info: { bg: '#EBF4FF', text: '#3182CE' }
    };
    
    return `
      <span style="display:inline-block;background-color:${colors[type].bg};color:${colors[type].text};padding:4px 8px;border-radius:4px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">
        ${text}
      </span>
    `;
  }
};