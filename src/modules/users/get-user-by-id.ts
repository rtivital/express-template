import z from 'zod';
import { User } from '@/generated/prisma/client';
import { createService } from '@/utils/create-service';

export const GetUserByIdSchema = z.object({
  id: z.int(),
});

export const getUserById = createService(
  GetUserByIdSchema,
  async (input, prisma): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id: input.id } });
  }
);
