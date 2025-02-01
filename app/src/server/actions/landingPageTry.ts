import {
  type CreateLandingPageTry,
} from 'wasp/server/operations';
import { LandingPageTry } from 'wasp/entities';
import { OpenAIService } from '../llm/openai';
import { truncateText, cleanMarkdown } from './utils';
import { MAX_TOKENS } from '../../shared/constants';


export const createLandingPageTry: CreateLandingPageTry<{
  name: string,
  userAgent: string,
  browserLanguage: string, 
  screenResolution: string,
  timezone: string,
  length: string,
  level: string,
  content: string,
  model: string,
  includeSummary: boolean,
  includeMCQuiz: boolean,
  priorKnowledge: string
}, {success: boolean, message: string, data: LandingPageTry}> = async (args, context) => {
  const { text: filtered_content, truncated } = truncateText(args.content);

  let exerciseJson: any;
  let exerciseJsonUsage = 0;
  let success = false;
  let lessonText = '';
  let paragraphSummary = '';
  
  try {
    // Generate exercise with a token limit
    const exerciseResponse = await OpenAIService.generateExercise(
      filtered_content,
      args.priorKnowledge,
      args.length,
      args.level,
      args.model,
      MAX_TOKENS
    );

    if (exerciseResponse.success && exerciseResponse.data) {
      exerciseJson = exerciseResponse.data;
      exerciseJsonUsage = exerciseResponse.usage || 0;
      lessonText = cleanMarkdown(exerciseJson.lectureContent);
      success = true;

      // Only generate summary if specifically requested and exercise generation was successful
      if (args.includeSummary) {
        const summaryResponse = await OpenAIService.generateSummary(
          lessonText,
          args.model,
          MAX_TOKENS
        );
        if (summaryResponse.success && summaryResponse.data) {
          paragraphSummary = summaryResponse.data.paragraphSummary || '';
        }
      }
    }
  } catch (error) {
    console.error('Error generating landing page try:', error);
    success = false;
  }

  const complexityJson = await OpenAIService.generateComplexity(lessonText, args.model, MAX_TOKENS);
  if (complexityJson.success && complexityJson.data.taggedText) {
    exerciseJson.taggedText = complexityJson.data.taggedText;
  }
  // Create the landing page try record
  const results = await context.entities.LandingPageTry.create({
    data: {
      userAgent: args.userAgent,
      browserLanguage: args.browserLanguage,
      screenResolution: args.screenResolution,
      timezone: args.timezone,
      name: args.name,
      prompt: exerciseJson.prompt || '',
      promptImg: exerciseJson.promptImg || '',
      lessonText: exerciseJson.taggedText || '',
      paragraphSummary: paragraphSummary,
      level: args.level,
      no_words: lessonText.split(' ').length,
      truncated,
      tokensUsed: exerciseJsonUsage,
      successful: success,
      model: args.model
    }
  });

  return { 
    success, 
    message: success ? 'Landing page try created successfully' : 'Failed to generate content',
    data: results 
  };
}