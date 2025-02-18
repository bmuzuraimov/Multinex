import { type User } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import {
  type UpdateCurrentUser,
  type UpdateUserById,
  type UpdateUserLang,
} from 'wasp/server/operations';

export const updateUserById: UpdateUserById<{ id: string; data: Partial<User> }, User> = async (
  { id, data },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }

  // ✅ Ensure the user can only update their own data (security check)
  const isAdmin = context.user.isAdmin; // Assuming `isAdmin` exists in your schema
  if (!isAdmin && context.user.id !== id) {
    throw new HttpError(403, "Forbidden: You can only update your own profile.");
  }

  try {
    const updatedUser = await context.entities.User.update({
      where: { id },
      data,
    });

    return updatedUser;
  } catch (error) {
    throw new HttpError(500, "Failed to update user: ");
  }
};

export const updateCurrentUser: UpdateCurrentUser<Partial<User>, User> = async (user, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: user,
  });
};

export const updateUserLang: UpdateUserLang<{ lang: string }, User> = async ({ lang }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      lang,
    },
  });
};
