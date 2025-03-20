import { z } from 'zod';

export const demoExerciseSchema = z.object({
  exercise_id: z.string().uuid(),
  user_agent: z.string().max(500),
  browser_language: z.string().max(10).optional(),
  screen_resolution: z.string().max(20).optional(), 
  timezone: z.string().max(50).optional(),
});

export const courseCreateSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  description: z.string().min(1).max(2000).trim(),
  image: z.string().trim(),
});

export const courseUpdateSchema = z.object({
  id: z.string(),
  data: z.object({
    name: z.string().min(1).max(100).trim().optional(),
    description: z.string().min(1).max(2000).trim().optional(),
    image: z.string().trim().optional(),
    is_public: z.boolean().optional(),
    duplicate_id: z.string().uuid().optional(),
  }),
});

export const courseGenerateSchema = z.object({
  syllabus_content: z.string().min(10).max(5000).trim(),
  image: z.string().url(),
});

export const courseIdSchema = z.object({
  id: z.string().uuid(),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  last_active: z.date().optional(),
  email: z.string().email().optional(),
  send_email: z.boolean().optional(),
  onboarding_complete: z.boolean().optional(),
  tour_complete: z.boolean().optional(),
  language: z.string().min(2).max(5).optional(),
  organization_id: z.string().uuid().nullable().optional(),
});

export const exerciseCreateSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  topic_id: z.string().uuid().nullable(),
});

export const exerciseGenerateSchema = z.object({
  exercise_id: z.string().uuid(),
  prior_knowledge: z.array(z.string()),
  length: z.string().min(1),
  level: z.string().min(1),
  model: z.string().min(1),
  include_summary: z.boolean(),
  include_mc_quiz: z.boolean(),
  sensory_modes: z.array(z.enum(['listen', 'type', 'write', 'mermaid'])),
});

export const exerciseShareSchema = z.object({
  exercise_id: z.string().uuid(),
  emails: z.array(z.string().email()),
});

export const exerciseUpdateSchema = z.object({
  id: z.string(),
  updated_data: z.object({
    name: z.string().min(1).max(100).trim().optional(),
    lesson_text: z.string().optional(),
    paragraph_summary: z.string().optional(),
    level: z.string().optional(),
    truncated: z.boolean().optional(),
    tokens: z.number().optional(),
    model: z.string().optional(),
    word_count: z.number().optional(),
    cursor: z.number().optional(),
    topic_id: z.string().uuid().nullable().optional(),
  }),
});

export const exerciseDeleteSchema = z.object({
  id: z.string().uuid(),
});
