

interface Report {
  id: string;
  severity: string;
  email: string;
  environment: string;
  description: string;
  steps: string;
  stackTrace: string;
  createdAt: Date;
}

const reportBugTemplate = (report: Report) => {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 30px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #dc2626; font-size: 28px; font-weight: 600; margin: 0;">Bug Report Alert</h1>
        <p style="color: #4a5568; font-size: 16px; margin-top: 8px;">Reference ID: BUG-${report.id}</p>
      </div>

      <div style="background-color: #fef2f2; padding: 25px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #fee2e2;">
        <h2 style="color: #991b1b; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #fecaca;">Issue Overview</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #991b1b; font-weight: 600; width: 40%;">Severity Level</td>
            <td style="padding: 8px 0; color: #7f1d1d;">${report.severity || 'Not Specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #991b1b; font-weight: 600;">Reported By</td>
            <td style="padding: 8px 0; color: #7f1d1d;">${report.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #991b1b; font-weight: 600;">Environment</td>
            <td style="padding: 8px 0; color: #7f1d1d;">${report.environment || 'Production'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #991b1b; font-weight: 600;">Timestamp</td>
            <td style="padding: 8px 0; color: #7f1d1d;">${new Date(report.createdAt).toLocaleString()}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
        <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">Issue Description</h2>
        <div style="color: #2d3748; line-height: 1.6; white-space: pre-wrap;">${report.description}</div>
      </div>

      ${report.steps ? `
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
          <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">Steps to Reproduce</h2>
          <div style="color: #2d3748; line-height: 1.6;">${report.steps}</div>
        </div>
      ` : ''}

      ${report.stackTrace ? `
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">Stack Trace</h2>
          <pre style="background-color: #1a202c; color: #e2e8f0; padding: 15px; border-radius: 4px; overflow-x: auto; font-family: monospace;">${report.stackTrace}</pre>
        </div>
      ` : ''}
    </div>
  `;
};

export default reportBugTemplate;