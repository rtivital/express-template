import status from 'http-status';
import z from 'zod';
import { HttpError } from '@/errors';
import { User } from '@/generated/prisma/client';
import { createService } from '@/utils/create-service';

export const BaseUserSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  name: z
    .string({ error: 'Name must be a string' })
    .min(2, { error: 'Must be at least 2 characters' })
    .max(100, { error: 'Must be at most 100 characters' }),
});

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
