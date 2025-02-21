import {
  type GetLandingPageTry,
} from 'wasp/server/operations';
import { preprocessEssay } from '../utils/exerciseUtils';

type FormattedEssaySection = {
  mode: 'hear' | 'type' | 'write';
  text: string[];
};



type LandingPageTryResult = {
  id: string;
  createdAt: Date;
  userAgent: string;
  browserLanguage: string | null;
  screenResolution: string | null;
  timezone: string | null;
  name: string;
  prompt: string;
  promptImg: string;
  audioTimestamps: Array<{word: string, start: number, end: number}> | string[];
  paragraphSummary: string;
  level: string;
  no_words: number;
  truncated: boolean;
  completedAt: Date | null;
  score: number;
  tokensUsed: number;
  successful: boolean;
  model: string;
  userEvaluation: number | null;
  convertedUserId: string | null;
  essay: string;
  formattedEssay: FormattedEssaySection[];
  [key: string]: any;
};

export const getLandingPageTry: GetLandingPageTry<{userAgent: string, browserLanguage: string, screenResolution: string, timezone: string}, LandingPageTryResult | null> = async (args, context) => {
  const result = await context.entities.LandingPageTry.findFirst({
    where: {
      userAgent: args.userAgent,
      browserLanguage: args.browserLanguage,
      screenResolution: args.screenResolution,
      timezone: args.timezone
    }
  });

  if (!result) return null;

  if (result.audioTimestamps && typeof result.audioTimestamps[0] === 'string') {
    result.audioTimestamps = result.audioTimestamps.map(timestamp => 
      JSON.parse(timestamp)
    );
  }

  const { essay, formattedEssay } = preprocessEssay(result.lessonText);
  
  return {
    ...result,
    essay,
    formattedEssay
  };
}
