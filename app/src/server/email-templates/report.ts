import { EmailTemplateFactory } from './components/EmailTemplateFactory';
import { BugReportEmail } from './report/BugReportEmail';

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

export const reportBugTemplate = (report: Report) => 
  EmailTemplateFactory.createTemplate(BugReportEmail, report);