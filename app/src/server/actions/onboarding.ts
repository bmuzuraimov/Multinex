import { HttpError } from 'wasp/server';
import type { CreateOnboarding } from 'wasp/server/operations';

export const createOnboarding: CreateOnboarding<{
  userType: string,
  learningStyle: string,
  scienceMedicine: boolean,
  technologyEngineering: boolean, 
  businessEconomics: boolean,
  humanitiesArts: boolean,
  languageLearning: boolean,
  testPrep: boolean,
  motivationProgress: boolean,
  motivationGamification: boolean,
  motivationReminders: boolean,
  motivationCommunity: boolean,
  motivationToolOnly: boolean,
  sourceTwitter: boolean,
  sourceInstagram: boolean,
  sourceTikTok: boolean,
  sourceFacebook: boolean,
  sourceYoutube: boolean,
  sourceGoogle: boolean,
  sourceWordOfMouth: boolean,
  featureRequest?: string
}> = async (onboarding, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const newOnboarding = await context.entities.Onboarding.upsert({
    where: {
      userId: context.user.id
    },
    create: {
      userType: onboarding.userType,
      learningStyle: onboarding.learningStyle,
      scienceMedicine: onboarding.scienceMedicine,
      technologyEngineering: onboarding.technologyEngineering,
      businessEconomics: onboarding.businessEconomics,
      humanitiesArts: onboarding.humanitiesArts,
      languageLearning: onboarding.languageLearning,
      testPrep: onboarding.testPrep,
      motivationProgress: onboarding.motivationProgress,
      motivationGamification: onboarding.motivationGamification,
      motivationReminders: onboarding.motivationReminders,
      motivationCommunity: onboarding.motivationCommunity,
      motivationToolOnly: onboarding.motivationToolOnly,
      sourceTwitter: onboarding.sourceTwitter,
      sourceInstagram: onboarding.sourceInstagram,
      sourceTikTok: onboarding.sourceTikTok,
      sourceFacebook: onboarding.sourceFacebook,
      sourceYoutube: onboarding.sourceYoutube,
      sourceGoogle: onboarding.sourceGoogle,
      sourceWordOfMouth: onboarding.sourceWordOfMouth,
      featureRequest: onboarding.featureRequest,
      user: { connect: { id: context.user.id } },
    },
    update: {
      userType: onboarding.userType,
      learningStyle: onboarding.learningStyle,
      scienceMedicine: onboarding.scienceMedicine,
      technologyEngineering: onboarding.technologyEngineering,
      businessEconomics: onboarding.businessEconomics,
      humanitiesArts: onboarding.humanitiesArts,
      languageLearning: onboarding.languageLearning,
      testPrep: onboarding.testPrep,
      motivationProgress: onboarding.motivationProgress,
      motivationGamification: onboarding.motivationGamification,
      motivationReminders: onboarding.motivationReminders,
      motivationCommunity: onboarding.motivationCommunity,
      motivationToolOnly: onboarding.motivationToolOnly,
      sourceTwitter: onboarding.sourceTwitter,
      sourceInstagram: onboarding.sourceInstagram,
      sourceTikTok: onboarding.sourceTikTok,
      sourceFacebook: onboarding.sourceFacebook,
      sourceYoutube: onboarding.sourceYoutube,
      sourceGoogle: onboarding.sourceGoogle,
      sourceWordOfMouth: onboarding.sourceWordOfMouth,
      featureRequest: onboarding.featureRequest,
    },
  });

  return newOnboarding;
};
