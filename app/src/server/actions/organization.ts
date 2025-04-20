import { type CreateOrganization, type UpdateOrganization, type DeleteOrganization } from 'wasp/server/operations';
import { Organization } from 'wasp/entities';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const createOrganization: CreateOrganization<Partial<Organization>, Response> = async (
  organizationData: Partial<Organization>,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const organization = await context.entities.Organization.create({
      data: { ...organizationData, user_id: context.user.id },
    });
    return {
      success: true,
      message: 'Organization created successfully',
      data: organization,
    };
  } catch (error: any) {
    throw new HttpError(500, 'Failed to create organization', { error: error.message });
  }
};

export const updateOrganization: UpdateOrganization<Partial<Organization>, Response> = async (
  organizationData: Partial<Organization>,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const organization = await context.entities.Organization.update({
      where: { id: organizationData.id, user_id: context.user.id },
      data: organizationData,
    });
    return {
      success: true,
      message: 'Organization updated successfully',
      data: organization,
    };
  } catch (error: any) {
    throw new HttpError(500, 'Failed to update organization', { error: error.message });
  }
};

export const deleteOrganization: DeleteOrganization<Partial<Organization>, Response> = async (
  organizationData: Partial<Organization>,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }
  try {
    const organization = await context.entities.Organization.delete({
      where: { id: organizationData.id, user_id: context.user.id },
    });
    return {
      success: true,
      message: 'Organization deleted successfully',
      data: organization,
    };
  } catch (error: any) {
    throw new HttpError(500, 'Failed to delete organization', { error: error.message });
  }
};
