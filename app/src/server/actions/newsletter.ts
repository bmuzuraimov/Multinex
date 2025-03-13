import { Newsletter } from "wasp/entities"
import { ApiResponse } from "./types"
import { type CreateNewsletter } from 'wasp/server/operations';

export const createNewsletter: CreateNewsletter<
  { 
    email: string,
    userAgent?: string,
    source?: string 
  }, 
  ApiResponse<Newsletter>
> = async ({ email, userAgent, source }, context) => {
  const created_newsletter = await context.entities.Newsletter.create({
    data: {
      email,
      source: source || 'website_footer',
      user_agent: userAgent || 'Unknown',
    },
  });

  return {
    success: true,
    code: 200,
    message: 'Newsletter created successfully',
    data: created_newsletter,
  };
};

