import { EmailTemplateFactory } from './components/EmailTemplateFactory';
import { BugReportEmail } from './report/BugReportEmail';

interface Report {
  id: string;
  severity: string;
  email: string;
  environment: string;
  description: string;
  steps: string;
  stack_trace: string;
  created_at: Date;
}

export const reportBugTemplate = (report: Report) => 
  EmailTemplateFactory.createTemplate(BugReportEmail, report);