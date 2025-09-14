import status from 'http-status';
import z from 'zod';
import { HttpError } from '@/errors';
import { User } from '@/generated/prisma/client';
import { createService } from '@/utils/create-service';

export const CreateUserSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(100),
});

export const createUser = createService(CreateUserSchema, async (input, prisma): Promise<User> => {
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
