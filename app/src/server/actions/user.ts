import { User } from 'wasp/entities';
import { type CreateUser, type UpdateUser, type DeleteUser } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

export const createUser: CreateUser<Partial<User>, Response> = async (
  userData: Partial<User>,
  context: { entities: { User: any } }
) => {
  try {
    const user = await context.entities.User.create({
      data: userData,
    });
    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to create user', { error: error.message });
  }
};

export const updateUser: UpdateUser<Partial<User>, Response> = async (userData: Partial<User>, context: any) => {
  try {
    const user = await context.entities.User.update({
      where: { id: context.user.id },
      data: userData,
    });
    return {
      success: true,
      message: 'User updated successfully',
      data: user,
    };
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to update user', { error: error.message });
  }
};

export const deleteUser: DeleteUser<Partial<User>, Response> = async (
  userData: Partial<User>,
  context: { entities: { User: any } }
) => {
  try {
    const user = await context.entities.User.delete({
      where: { id: userData.id },
    });
    return {
      success: true,
      message: 'User deleted successfully',
      data: user,
    };
  } catch (error: any) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to delete user', { error: error.message });
  }
};
