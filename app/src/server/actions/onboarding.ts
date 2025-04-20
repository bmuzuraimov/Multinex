import { Onboarding } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type CreateOnboarding, type UpdateOnboarding, type DeleteOnboarding } from 'wasp/server/operations';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const createOnboarding: CreateOnboarding<Partial<Onboarding>, Response> = async (
  onboardingData: Partial<Onboarding>,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const onboarding = await context.entities.Onboarding.upsert({
      where: {
        user_id: context.user.id,
      },
      create: {
        ...onboardingData,
        user: { connect: { id: context.user.id } },
      },
      update: onboardingData,
    });

    return {
      success: true,
      message: 'Onboarding created successfully',
      data: onboarding,
    };
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to create onboarding', { error: error.message });
  }
};

export const updateOnboarding: UpdateOnboarding<Partial<Onboarding>, Response> = async (
  onboardingData: Partial<Onboarding>,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const onboarding = await context.entities.Onboarding.update({
      where: { user_id: context.user.id },
      data: onboardingData,
    });

    return {
      success: true,
      message: 'Onboarding updated successfully',
      data: onboarding,
    };
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to update onboarding', { error: error.message });
  }
};

export const deleteOnboarding: DeleteOnboarding<Partial<Onboarding>, Response> = async (
  onboardingData: Partial<Onboarding>,
  context: any
) => {
  try {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized');
    }

    const onboarding = await context.entities.Onboarding.delete({
      where: { user_id: context.user.id },
    });

    return {
      success: true,
      message: 'Onboarding deleted successfully',
      data: onboarding,
    };
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to delete onboarding', { error: error.message });
  }
};
