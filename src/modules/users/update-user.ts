import status from 'http-status';
import { HttpError } from '@/errors';
import { User } from '@/generated/prisma/client';
import { createService } from '@/utils/create-service';
import { IntIdSchema } from '@/validation';
import { BaseUserSchema } from './create-user';
import { getUserById } from './get-user-by-id';

export const UpdateUserSchema = BaseUserSchema.extend({
  id: IntIdSchema,
});

export const updateUser = createService(UpdateUserSchema, async (input, prisma): Promise<User> => {
  const existingUser = await getUserById({ id: input.id }, prisma);

  if (!existingUser) {
    throw new HttpError(status.NOT_FOUND, 'User not found');
  }

  const user = await prisma.user.update({
    where: { id: input.id },
    data: {
      email: input.email,
      name: input.name,
    },
  });

  return user;
});
