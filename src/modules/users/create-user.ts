import status from 'http-status';
import { HttpError } from '@/errors';
import { User } from '@/generated/prisma/client';
import { createService } from '@/utils/create-service';
import { BaseUserSchema } from './users-schema';

export const createUser = createService(BaseUserSchema, async (input, prisma): Promise<User> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

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
