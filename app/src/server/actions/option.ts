import { type CreateOption, type UpdateOption, type DeleteOption } from 'wasp/server/operations';
import { Option } from 'wasp/entities';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const createOption: CreateOption<Partial<Option>, Response> = async (
  optionData: Partial<Option>,
  context: { entities: { Option: any } }
) => {
  try {
    const option = await context.entities.Option.create({
      data: optionData,
    });
    return {
      success: true,
      message: 'Option created successfully',
      data: option,
    };
  } catch (error: any) {
    throw new HttpError(500, 'Failed to create option', { error: error.message });
  }
};

export const updateOption: UpdateOption<Partial<Option>, Response> = async (
  optionData: Partial<Option>,
  context: { entities: { Option: any } }
) => {
  try {
    const option = await context.entities.Option.update({
      where: { id: optionData.id },
      data: optionData,
    });
    return {
      success: true,
      message: 'Option updated successfully',
      data: option,
    };
  } catch (error: any) {
    throw new HttpError(500, 'Failed to update option', { error: error.message });
  }
};

export const deleteOption: DeleteOption<Partial<Option>, Response> = async (
  optionData: Partial<Option>,
  context: { entities: { Option: any } }
) => {
  try {
    const option = await context.entities.Option.delete({
      where: { id: optionData.id },
    });
    return {
      success: true,
      message: 'Option deleted successfully',
      data: option,
    };
  } catch (error: any) {
    throw new HttpError(500, 'Failed to delete option', { error: error.message });
  }
};
