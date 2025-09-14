import z from 'zod';
import { HttpError } from '@/errors';
import { User } from '@/generated/prisma/client';
import { createService } from '@/utils/create-service';

const GetUserByIdSchema = z.object({
  id: z.int(),
});

export const getUserById = createService(
  GetUserByIdSchema,
  async (input, prisma): Promise<User> => {
    const user = await prisma.user.findUnique({
      where: { id: input.id },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new HttpError(404, 'User not found', { id: input.id });
    }

    return user;
  }
);
