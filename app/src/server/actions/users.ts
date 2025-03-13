import { type User } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import { type UpdateCurrentUser } from 'wasp/server/operations';
import { ApiResponse } from './types';
import { updateUserSchema } from './validations';
import { handleError } from './utils';

export const updateCurrentUser: UpdateCurrentUser<Partial<User>, ApiResponse<User>> = async (user_data, context) => {
  try {
    if (!context.user) {
      throw new HttpError(401, 'Unauthorized access');
    }

    const validatedData = updateUserSchema.parse(user_data);

    const updated_user = await context.entities.User.update({
      where: {
        id: context.user.id,
      },
      data: validatedData,
    });

    return {
      success: true,
      code: 200,
      message: 'User updated successfully',
      data: updated_user,
    };
  } catch (error) {
    return handleError(error, 'update user');
  }
};
