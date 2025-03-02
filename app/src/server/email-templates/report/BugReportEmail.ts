import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components } from '../components/BaseTemplate';

interface BugReportParams {
  id: string;
  severity: string;
  email: string;
  environment: string;
  description: string;
  steps: string;
  stackTrace: string;
  createdAt: Date;
}

export class BugReportEmail extends BaseEmailTemplate {
  constructor(private params: BugReportParams) {
    super();
  }

  protected generateSubject(): string {
    return `Bug Report Alert - BUG-${this.params.id}`;
  }

  protected generateText(): string {
    const { id, severity, email, environment, description, steps, stackTrace, createdAt } = this.params;
    return `
Bug Report Alert
Reference ID: BUG-${id}

Issue Overview:
Severity Level: ${severity || 'Not Specified'}
Reported By: ${email}
Environment: ${environment || 'Production'}
Timestamp: ${new Date(createdAt).toLocaleString()}

Issue Description:
${description}

${steps ? `Steps to Reproduce:
${steps}

` : ''}${stackTrace ? `Stack Trace:
${stackTrace}` : ''}`;
  }

  protected generateHtmlContent(): string {
    const { id, severity, email, environment, description, steps, stackTrace, createdAt } = this.params;
    
    return `
      <div style="text-align: center;">
        <div style="color: #dc2626;">
          ${components.heading('Bug Report Alert')}
        </div>
        <div style="color: #4a5568; font-size: 16px;">
          ${components.paragraph(`Reference ID: BUG-${id}`)}
        </div>
      </div>
      
      <div style="background-color: #fef2f2; padding: 25px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #fee2e2;">
        <div style="color: #991b1b; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #fecaca;">
          ${components.heading('Issue Overview')}
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #991b1b; font-weight: 600; width: 40%;">Severity Level</td>
            <td style="padding: 8px 0; color: #7f1d1d;">${severity || 'Not Specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #991b1b; font-weight: 600;">Reported By</td>
            <td style="padding: 8px 0; color: #7f1d1d;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #991b1b; font-weight: 600;">Environment</td>
            <td style="padding: 8px 0; color: #7f1d1d;">${environment || 'Production'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #991b1b; font-weight: 600;">Timestamp</td>
            <td style="padding: 8px 0; color: #7f1d1d;">${new Date(createdAt).toLocaleString()}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
        <div style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
          ${components.heading('Issue Description')}
        </div>
        <div style="white-space: pre-wrap;">
          ${components.paragraph(description)}
        </div>
      </div>

      ${steps ? `
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
          <div style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
            ${components.heading('Steps to Reproduce')}
          </div>
          ${components.paragraph(steps)}
        </div>
      ` : ''}

      ${stackTrace ? `
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <div style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
            ${components.heading('Stack Trace')}
          </div>
          <pre style="background-color: #1a202c; color: #e2e8f0; padding: 15px; border-radius: 4px; overflow-x: auto; font-family: monospace;">${stackTrace}</pre>
        </div>
      ` : ''}
    `;
  }
} 