import z from 'zod';
import { HttpError } from '@/errors';
import { User } from '@/generated/prisma/client';
import { createService } from '@/utils/create-service';

const GetUserByEmailSchema = z.object({
  email: z.email(),
});

export const getUserByEmail = createService(
  GetUserByEmailSchema,
  async (input, prisma): Promise<User> => {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new HttpError(404, 'User not found', { email: input.email });
    }

    return user;
  }
);
