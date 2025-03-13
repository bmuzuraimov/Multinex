import { encoding_for_model } from 'tiktoken';
import { OPENAI_MODEL, MAX_TOKENS } from '../../shared/constants';
import { emailSender } from 'wasp/server/email';
import { reportBugTemplate } from '../email-templates/report';
import z from 'zod';
import { v4 as uuidv4 } from 'uuid';

const ENCODING = encoding_for_model(OPENAI_MODEL);

// Error severity levels following industry standards
export enum ErrorSeverity {
  LOW = 'low',       // Non-critical errors that don't affect core functionality
  MEDIUM = 'medium', // Errors that affect some functionality but system remains operational
  HIGH = 'high',     // Serious errors that affect core functionality
  CRITICAL = 'critical' // System-breaking errors that require immediate attention
}

// Standard error response type
export type ErrorResponse = {
  success: false;
  code: number;
  message: string;
  errors?: any[];
};

// Error categories for better organization and tracking
export enum ErrorCategory {
  VALIDATION = 'validation_error',
  AUTHORIZATION = 'authorization_error',
  DATABASE = 'database_error',
  EXTERNAL_SERVICE = 'external_service_error',
  BUSINESS_LOGIC = 'business_logic_error',
  SYSTEM = 'system_error'
}

// Configuration for error handling
const ERROR_CONFIG = {
  shouldNotifyAdmin: {
    [ErrorSeverity.LOW]: false,
    [ErrorSeverity.MEDIUM]: true,
    [ErrorSeverity.HIGH]: true,
    [ErrorSeverity.CRITICAL]: true
  },
  retryable: {
    [ErrorCategory.VALIDATION]: false,
    [ErrorCategory.AUTHORIZATION]: false,
    [ErrorCategory.DATABASE]: true,
    [ErrorCategory.EXTERNAL_SERVICE]: true,
    [ErrorCategory.BUSINESS_LOGIC]: false,
    [ErrorCategory.SYSTEM]: true
  }
};

export const truncateText = (input_text: any) => {
  try {
    if (typeof input_text !== 'string') {
      console.error('Invalid type for text:', typeof input_text, 'Value:', input_text);
      throw new TypeError('Text must be a string.');
    }

    let processed_text = input_text.replace(/[^\x00-\x7F]/g, '').replace(/\s+/g, ' ');

    const encoded_tokens = ENCODING.encode(processed_text);

    if (encoded_tokens.length <= MAX_TOKENS) {
      return { truncated: false, text: processed_text };
    }

    const truncated_tokens = encoded_tokens.slice(0, MAX_TOKENS);
    const truncated_text: string = new TextDecoder().decode(ENCODING.decode(truncated_tokens));

    return { truncated: true, text: truncated_text };
  } catch (error) {
    console.error('Error in truncateText:', error);
    throw error; // Re-throw after logging
  }
};

export const sendErrorToAdmin = async (error_message: {
  id: string;
  severity: string;
  email: string;
  description: string;
  steps: string[];
  stack_trace: string;
}) => {
  const { subject, text, html } = reportBugTemplate({
    id: error_message.id,
    severity: error_message.severity,
    email: error_message.email,
    environment: process.env.NODE_ENV!,
    description: error_message.description,
    steps: error_message.steps.join('\n'),
    stack_trace: error_message.stack_trace,
    created_at: new Date()
  });
  await emailSender.send({
    to: process.env.ADMIN_EMAILS!,
    subject,
    text,
    html,
  });
};

export const cleanMarkdown = (input_text: string): string => {
  if (!input_text) {
    return '';
  }
  return (
    input_text
      // Remove bold markdown
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Replace em dashes
      .replace(/—/g, '-')
      // Replace en dashes
      .replace(/–/g, '-')
      // Remove headers
      .replace(/#{1,6}\s/g, '')
      // Remove spaces after new line before alphanumeric characters
      .replace(/\n\s*([a-zA-Z0-9])/g, '$1')
  );
};

export const validateUserAccess = (context: any) => {
  if (!context.user) {
    throw new Error('Unauthorized access');
  }
  return context.user;
};

const categorizeError = (error: unknown): { 
  category: ErrorCategory; 
  severity: ErrorSeverity;
  code: number;
} => {
  if (error instanceof z.ZodError) {
    return {
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      code: 400
    };
  }

  if (error instanceof Error) {
    // Authorization errors
    if (error.message === 'Unauthorized access') {
      return {
        category: ErrorCategory.AUTHORIZATION,
        severity: ErrorSeverity.MEDIUM,
        code: 401
      };
    }

    // Database errors
    if (error.message.includes('prisma') || error.message.includes('database')) {
      return {
        category: ErrorCategory.DATABASE,
        severity: ErrorSeverity.HIGH,
        code: 500
      };
    }

    // External service errors (e.g., OpenAI)
    if (error.message.includes('openai') || error.message.includes('api')) {
      return {
        category: ErrorCategory.EXTERNAL_SERVICE,
        severity: ErrorSeverity.HIGH,
        code: 502
      };
    }
  }

  // Default to system error for unknown cases
  return {
    category: ErrorCategory.SYSTEM,
    severity: ErrorSeverity.HIGH,
    code: 500
  };
};

const formatErrorMessage = (error: unknown): string => {
  if (error instanceof z.ZodError) {
    return 'Invalid input data: ' + error.errors.map(e => e.message).join(', ');
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

const getErrorStack = (error: unknown): string => {
  if (error instanceof Error) {
    return error.stack || '';
  }
  return '';
};

export const handleError = async (error: unknown, operation: string): Promise<ErrorResponse> => {
  const error_id = uuidv4();
  const { category, severity, code } = categorizeError(error);
  const formatted_message = formatErrorMessage(error);
  const stack_trace = getErrorStack(error);

  // Log the error with all relevant information
  console.error('Error Details:', {
    error_id,
    operation,
    category,
    severity,
    message: formatted_message,
    stack: stack_trace,
    timestamp: new Date().toISOString()
  });

  // Determine if admin notification is needed
  if (ERROR_CONFIG.shouldNotifyAdmin[severity]) {
    try {
      const { subject, text, html } = reportBugTemplate({
        id: error_id,
        severity,
        email: process.env.ADMIN_EMAILS || '',
        environment: process.env.NODE_ENV!,
        description: formatted_message,
        steps: operation,
        stack_trace,
        created_at: new Date()
      });

      await emailSender.send({
        to: process.env.ADMIN_EMAILS!,
        subject,
        text,
        html,
      }).catch(email_error => {
        console.error('Failed to send error notification email:', email_error);
      });
    } catch (notification_error) {
      console.error('Error while sending admin notification:', notification_error);
    }
  }

  // Return standardized error response
  const response: ErrorResponse = {
    success: false,
    code,
    message: formatted_message
  };

  // Add validation errors if present
  if (error instanceof z.ZodError) {
    response.errors = error.errors;
  }

  return response;
};
