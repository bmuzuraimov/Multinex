import { BaseEmailTemplate } from '../components/EmailTemplateFactory';
import { components, styles, styleToString } from '../components/BaseTemplate';

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
      ${components.subheading('Feedback Overview')}
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0;">
        <tr>
          <td style="${styleToString({ ...styles.text, width: '40%', fontWeight: '600' })}">Category</td>
          <td style="${styleToString(styles.text)}">${category}</td>
        </tr>
        <tr>
          <td style="${styleToString({ ...styles.text, width: '40%', fontWeight: '600' })}">Rating</td>
          <td style="${styleToString({ ...styles.text, color: '#F6B100' })}">${ratingStars} (${rating}/5)</td>
        </tr>
        <tr>
          <td style="${styleToString({ ...styles.text, width: '40%', fontWeight: '600' })}">Would Recommend</td>
          <td style="${styleToString(styles.text)}">${wouldRecommend ? 'Yes' : 'No'}</td>
        </tr>
        <tr>
          <td style="${styleToString({ ...styles.text, width: '40%', fontWeight: '600' })}">Experience Level</td>
          <td style="${styleToString(styles.text)}">${experienceLevel || 'Not specified'}</td>
        </tr>
      </table>
    `);

    const messageCard = components.card(`
      ${components.subheading('Message')}
      <div style="white-space: pre-wrap;">${message}</div>
    `);

    const usabilityCard = usability ? components.card(`
      ${components.subheading('Usability Feedback')}
      <div style="white-space: pre-wrap;">${usability}</div>
    `) : '';

    const featuresCard = features ? components.card(`
      ${components.subheading('Features Feedback')}
      <div style="white-space: pre-wrap;">${features}</div>
    `) : '';

    const improvementsCard = improvements ? components.card(`
      ${components.subheading('Suggested Improvements')}
      <div style="white-space: pre-wrap;">${improvements}</div>
    `) : '';

    const browserCard = components.card(`
      ${components.subheading('Browser Information')}
      <pre style="margin: 0; padding: ${styles.text.padding}; background-color: #1a202c; color: #e2e8f0; border-radius: 4px; overflow-x: auto; font-family: monospace; font-size: 14px; line-height: 1.4;">${browserInfo}</pre>
    `);

    return `
      ${components.heading('New Feedback Received')}
      ${components.paragraph(`From: <strong>${email}</strong>`)}
      ${components.divider()}
      ${overviewCard}
      ${messageCard}
      ${usabilityCard}
      ${featuresCard}
      ${improvementsCard}
      ${browserCard}
    `;
  }
} 