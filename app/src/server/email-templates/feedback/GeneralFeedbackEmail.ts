import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components, styles, convertStyleToString } from '../components/BaseTemplate';

interface GeneralFeedbackParams {
  message: string;
  email: string;
  rating: number;
  usability?: string;
  features?: string;
  improvements?: string;
  wouldRecommend: boolean;
  experienceLevel?: string;
  category: string;
  browserInfo: string;
}

export class GeneralFeedbackEmail extends BaseEmailTemplate {
  constructor(private params: GeneralFeedbackParams) {
    super();
  }

  protected generateSubject(): string {
    return `New Feedback from ${this.params.email}`;
  }

  protected generateText(): string {
    const { 
      message, 
      email, 
      rating, 
      usability, 
      features, 
      improvements, 
      wouldRecommend, 
      experienceLevel,
      category,
      browserInfo 
    } = this.params;

    return `
New Feedback Received
From: ${email}

Category: ${category}
Rating: ${'★'.repeat(rating)}${' ☆'.repeat(5-rating)} (${rating}/5)
Would Recommend: ${wouldRecommend ? 'Yes' : 'No'}
Experience Level: ${experienceLevel || 'Not specified'}

Message:
${message}

${usability ? `Usability Feedback:
${usability}

` : ''}${features ? `Features Feedback:
${features}

` : ''}${improvements ? `Suggested Improvements:
${improvements}

` : ''}Browser Information:
${browserInfo}`;
  }

  protected generateHtmlContent(): string {
    const { 
      message, 
      email, 
      rating, 
      usability, 
      features, 
      improvements, 
      wouldRecommend, 
      experienceLevel,
      category,
      browserInfo 
    } = this.params;

    const ratingStars = '★'.repeat(rating) + '☆'.repeat(5-rating);

    const overviewCard = components.card(`
      <tr>${components.subheading('Feedback Overview')}</tr>
      <tr>
        <td>
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0;">
            <tr>
              <td style="${convertStyleToString({ ...styles.text, width: '40%', fontWeight: '600' })}">Category</td>
              <td style="${convertStyleToString(styles.text)}">${category}</td>
            </tr>
            <tr>
              <td style="${convertStyleToString({ ...styles.text, width: '40%', fontWeight: '600' })}">Rating</td>
              <td style="${convertStyleToString({ ...styles.text, color: '#F6B100' })}">${ratingStars} (${rating}/5)</td>
            </tr>
            <tr>
              <td style="${convertStyleToString({ ...styles.text, width: '40%', fontWeight: '600' })}">Would Recommend</td>
              <td style="${convertStyleToString(styles.text)}">${wouldRecommend ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td style="${convertStyleToString({ ...styles.text, width: '40%', fontWeight: '600' })}">Experience Level</td>
              <td style="${convertStyleToString(styles.text)}">${experienceLevel || 'Not specified'}</td>
            </tr>
          </table>
        </td>
      </tr>
    `);

    const messageCard = components.card(`
      <tr>${components.subheading('Message')}</tr>
      <tr>
        <td>
          <div style="white-space: pre-wrap;">${message}</div>
        </td>
      </tr>
    `);

    const usabilityCard = usability ? components.card(`
      <tr>${components.subheading('Usability Feedback')}</tr>
      <tr>
        <td>
          <div style="white-space: pre-wrap;">${usability}</div>
        </td>
      </tr>
    `) : '';

    const featuresCard = features ? components.card(`
      <tr>${components.subheading('Features Feedback')}</tr>
      <tr>
        <td>
          <div style="white-space: pre-wrap;">${features}</div>
        </td>
      </tr>
    `) : '';

    const improvementsCard = improvements ? components.card(`
      <tr>${components.subheading('Suggested Improvements')}</tr>
      <tr>
        <td>
          <div style="white-space: pre-wrap;">${improvements}</div>
        </td>
      </tr>
    `) : '';

    const browserCard = components.card(`
      <tr>${components.subheading('Browser Information')}</tr>
      <tr>
        <td>
          <pre style="margin: 0; padding: ${styles.text.padding}; background-color: #1a202c; color: #e2e8f0; border-radius: 4px; overflow-x: auto; font-family: monospace; font-size: 14px; line-height: 1.4;">${browserInfo}</pre>
        </td>
      </tr>
    `);

    return `
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>${components.heading('New Feedback Received')}</tr>
        <tr>${components.paragraph(`From: <strong>${email}</strong>`)}</tr>
        <tr>${components.divider()}</tr>
        <tr>${overviewCard}</tr>
        <tr>${messageCard}</tr>
        ${usabilityCard ? `<tr>${usabilityCard}</tr>` : ''}
        ${featuresCard ? `<tr>${featuresCard}</tr>` : ''}
        ${improvementsCard ? `<tr>${improvementsCard}</tr>` : ''}
        <tr>${browserCard}</tr>
      </table>
    `;
  }
} 