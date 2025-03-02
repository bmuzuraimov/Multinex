import { encoding_for_model } from 'tiktoken';
import { OPENAI_MODEL, MAX_TOKENS } from '../../shared/constants';
import { emailSender } from 'wasp/server/email';


const encoding = encoding_for_model(OPENAI_MODEL);

export const truncateText = (text: any) => {
  try {
    if (typeof text !== 'string') {
      console.error('Invalid type for text:', typeof text, 'Value:', text);
      throw new TypeError('Text must be a string.');
    }

    text = text.replace(/[^\x00-\x7F]/g, '').replace(/\s+/g, ' ');

    const tokens = encoding.encode(text);

    if (tokens.length <= MAX_TOKENS) {
      return { truncated: false, text };
    }

    const truncatedTokens = tokens.slice(0, MAX_TOKENS);
    const truncatedText: string = new TextDecoder().decode(encoding.decode(truncatedTokens));

    return { truncated: true, text: truncatedText };
  } catch (error) {
    console.error('Error in truncateText:', error);
    throw error; // Re-throw after logging
  }
};

export const reportToAdmin = async (message: string) => {
  await emailSender.send({
    to: process.env.ADMIN_EMAILS!,
    subject: 'Typit.app Error',
    text: message,
    html: message,
  });
};

export const cleanMarkdown = (text: string): string => {
  if (!text) {
    return '';
  }
  return text
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
    .replace(/\n\s*([a-zA-Z0-9])/g, '$1');
}
