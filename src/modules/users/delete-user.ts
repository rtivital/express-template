import status from 'http-status';
import { HttpError } from '@/errors';
import { User } from '@/generated/prisma/client';
import { createService } from '@/utils/create-service';
import { IdObjectSchema } from '@/validation';
import { getUserById } from './get-user-by-id';

export const deleteUser = createService(IdObjectSchema, async (input, prisma): Promise<User> => {
  const existingUser = await getUserById({ id: input.id }, prisma);

  if (!existingUser) {
    throw new HttpError(status.NOT_FOUND, 'User not found');
  }

  const user = await prisma.user.delete({
    where: { id: input.id },
  });

  return user;
});
