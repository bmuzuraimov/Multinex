import { type GetVerificationEmailContentFn, type GetPasswordResetEmailContentFn } from 'wasp/server/auth';
import { verificationEmailContent, passwordResetEmailContent } from '../email-templates/auth';

export const getVerificationEmailContent: GetVerificationEmailContentFn = ({ verificationLink }) =>
  verificationEmailContent({ verificationLink });

export const getPasswordResetEmailContent: GetPasswordResetEmailContentFn = ({ passwordResetLink }) =>
  passwordResetEmailContent({ passwordResetLink });