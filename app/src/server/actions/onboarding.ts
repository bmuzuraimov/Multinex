import { HttpError } from 'wasp/server';
import type { CreateOnboarding } from 'wasp/server/operations';
import { ApiResponse } from './types';
import { Onboarding } from 'wasp/entities';

export const createOnboarding: CreateOnboarding<
  {
    user_type: string;
    learning_style: string;
    science_medicine: boolean;
    technology_engineering: boolean;
    business_economics: boolean;
    humanities_arts: boolean;
    language_learning: boolean;
    test_prep: boolean;
    motivation_progress: boolean;
    motivation_gamification: boolean;
    motivation_reminders: boolean;
    motivation_community: boolean;
    motivation_tool_only: boolean;
    source_twitter: boolean;
    source_instagram: boolean;
    source_tiktok: boolean;
    source_facebook: boolean;
    source_youtube: boolean;
    source_google: boolean;
    source_word_of_mouth: boolean;
    feature_request?: string;
  },
  ApiResponse<Onboarding>
> = async (onboarding, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const new_onboarding = await context.entities.Onboarding.upsert({
    where: {
      user_id: context.user.id,
    },
    create: {
      user_type: onboarding.user_type,
      learning_style: onboarding.learning_style,
      science_medicine: onboarding.science_medicine,
      technology_engineering: onboarding.technology_engineering,
      business_economics: onboarding.business_economics,
      humanities_arts: onboarding.humanities_arts,
      language_learning: onboarding.language_learning,
      test_prep: onboarding.test_prep,
      motivation_progress: onboarding.motivation_progress,
      motivation_gamification: onboarding.motivation_gamification,
      motivation_reminders: onboarding.motivation_reminders,
      motivation_community: onboarding.motivation_community,
      motivation_tool_only: onboarding.motivation_tool_only,
      source_twitter: onboarding.source_twitter,
      source_instagram: onboarding.source_instagram,
      source_tiktok: onboarding.source_tiktok,
      source_facebook: onboarding.source_facebook,
      source_youtube: onboarding.source_youtube,
      source_google: onboarding.source_google,
      source_word_of_mouth: onboarding.source_word_of_mouth,
      feature_request: onboarding.feature_request,
      user: { connect: { id: context.user.id } },
    },
    update: {
      user_type: onboarding.user_type,
      learning_style: onboarding.learning_style,
      science_medicine: onboarding.science_medicine,
      technology_engineering: onboarding.technology_engineering,
      business_economics: onboarding.business_economics,
      humanities_arts: onboarding.humanities_arts,
      language_learning: onboarding.language_learning,
      test_prep: onboarding.test_prep,
      motivation_progress: onboarding.motivation_progress,
      motivation_gamification: onboarding.motivation_gamification,
      motivation_reminders: onboarding.motivation_reminders,
      motivation_community: onboarding.motivation_community,
      motivation_tool_only: onboarding.motivation_tool_only,
      source_twitter: onboarding.source_twitter,
      source_instagram: onboarding.source_instagram,
      source_tiktok: onboarding.source_tiktok,
      source_facebook: onboarding.source_facebook,
      source_youtube: onboarding.source_youtube,
      source_google: onboarding.source_google,
      source_word_of_mouth: onboarding.source_word_of_mouth,
      feature_request: onboarding.feature_request,
    },
  });

  return {
    success: true,
    code: 200,
    message: 'Onboarding created successfully',
    data: new_onboarding,
  };
};
