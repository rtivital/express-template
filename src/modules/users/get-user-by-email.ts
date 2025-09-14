import z from 'zod';
import { User } from '@/generated/prisma/client';
import { createService } from '@/utils/create-service';

export const GetUserByEmailSchema = z.object({
  email: z.email(),
});

export const getUserByEmail = createService(
  GetUserByEmailSchema,
  async (input, prisma): Promise<User | null> => {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    return user;
  }
);
