import {
  type GetLandingPageTry,
} from 'wasp/server/operations';
import { LandingPageTry } from 'wasp/entities';

export const getLandingPageTry: GetLandingPageTry<{userAgent: string, browserLanguage: string, screenResolution: string, timezone: string}, LandingPageTry | null> = async (args, context) => {
  return context.entities.LandingPageTry.findFirst({
    where: {
      userAgent: args.userAgent,
      browserLanguage: args.browserLanguage,
      screenResolution: args.screenResolution,
      timezone: args.timezone
    }
  });
}