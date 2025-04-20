import { Newsletter } from "wasp/entities"
import { type CreateNewsletter, type UpdateNewsletter, type DeleteNewsletter } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const createNewsletter: CreateNewsletter<Partial<Newsletter>, Response> = async (
  newsletterData: Partial<Newsletter>,
  context: { entities: { Newsletter: any } }
) => {
  try {
    const newsletter = await context.entities.Newsletter.create({
      data: newsletterData,
    });
    return {
      success: true,
      message: 'Newsletter created successfully',
      data: newsletter,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error creating newsletter');
  }
};

export const updateNewsletter: UpdateNewsletter<Partial<Newsletter>, Response> = async (
  newsletterData: Partial<Newsletter>, 
  context: { entities: { Newsletter: any } }
) => {
  try {
    const newsletter = await context.entities.Newsletter.update({
      where: { id: newsletterData.id },
      data: newsletterData,
    });
    return {
      success: true,
      message: 'Newsletter updated successfully',
      data: newsletter,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error updating newsletter');
  }
};

export const deleteNewsletter: DeleteNewsletter<Partial<Newsletter>, Response> = async (
  newsletterData: Partial<Newsletter>,
  context: { entities: { Newsletter: any } }
) => {
  try {
    const newsletter = await context.entities.Newsletter.delete({
      where: { id: newsletterData.id },
    });
    return {
      success: true, 
      message: 'Newsletter deleted successfully',
      data: newsletter,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error deleting newsletter');
  }
};
