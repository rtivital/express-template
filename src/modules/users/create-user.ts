import status from 'http-status';
import { HttpError } from '@/errors';
import { User } from '@/generated/prisma/client';
import { createService } from '@/utils/create-service';
import { getUserByEmail } from './get-user-by-email';
import { BaseUserSchema } from './users-schema';

export const createUser = createService(BaseUserSchema, async (input, prisma): Promise<User> => {
  const existingUser = await getUserByEmail({ email: input.email }, prisma);

  if (existingUser) {
    throw new HttpError(status.CONFLICT, 'User with this email already exists');
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
    },
  });

  return user;
});
