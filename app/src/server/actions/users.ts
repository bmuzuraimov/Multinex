import { type User } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import {
  type UpdateCurrentUser,
  type UpdateUserLang,
} from 'wasp/server/operations';

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
