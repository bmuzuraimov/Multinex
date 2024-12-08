import { Feedback } from "wasp/entities";

const feedbackTemplate = (feedback: Feedback) => {
  const ratingStars = '⭐'.repeat(feedback.rating);
  const recommendationText = feedback.wouldRecommend ? 'Would recommend' : 'Would not recommend';
  
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 30px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a365d; font-size: 28px; font-weight: 600; margin: 0;">Feedback Report</h1>
        <p style="color: #4a5568; font-size: 16px; margin-top: 8px;">Reference ID: FB-${feedback.id}</p>
      </div>

      <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
        <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">Submission Overview</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 40%;">Category</td>
            <td style="padding: 8px 0; color: #2d3748;">${feedback.category}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Submitter</td>
            <td style="padding: 8px 0; color: #2d3748;">${feedback.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Experience Level</td>
            <td style="padding: 8px 0; color: #2d3748;">${feedback.experienceLevel || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Satisfaction Rating</td>
            <td style="padding: 8px 0; color: #2d3748;">${ratingStars} (${feedback.rating}/5)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Net Promoter Status</td>
            <td style="padding: 8px 0; color: #2d3748;">${recommendationText}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
        <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">Primary Feedback</h2>
        <div style="color: #2d3748; line-height: 1.6; white-space: pre-wrap;">${feedback.message}</div>
      </div>

      ${feedback.usability ? `
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
          <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">Usability Assessment</h2>
          <div style="color: #2d3748; line-height: 1.6;">${feedback.usability}</div>
        </div>
      ` : ''}

      ${feedback.features ? `
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
          <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">Feature Analysis</h2>
          <div style="color: #2d3748; line-height: 1.6;">${feedback.features}</div>
        </div>
      ` : ''}

      ${feedback.improvements ? `
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
          <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">Improvement Recommendations</h2>
          <div style="color: #2d3748; line-height: 1.6;">${feedback.improvements}</div>
        </div>
      ` : ''}

      <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; border: 1px solid #e2e8f0;">
        <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">System Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #4a5568; font-weight: 600; width: 40%;">Browser Environment</td>
            <td style="padding: 8px 0; color: #2d3748;">${feedback.browserInfo || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Submission Timestamp</td>
            <td style="padding: 8px 0; color: #2d3748;">${feedback.createdAt.toLocaleString()}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="color: #718096; font-size: 14px;">This is an automated feedback report. Please do not reply to this email.</p>
      </div>
    </div>
  `;
};

export default feedbackTemplate;