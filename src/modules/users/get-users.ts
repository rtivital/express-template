import { User } from '@/generated/prisma/client';
import { redisClient } from '@/redis';
import { createService } from '@/utils/create-service';
import { paginate, PaginatedResult } from '@/utils/paginate';
import { PaginationParamsSchema } from '@/validation';

export const getUsers = createService(
  PaginationParamsSchema,
  async (input, prisma): Promise<PaginatedResult<User>> => {
    const cacheKey = `users:${JSON.stringify(input)}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return JSON.parse(cached) as PaginatedResult<User>;
    }

    const result = await paginate(
      prisma.user,
      { where: {} },
      { page: input.page, pageSize: input.pageSize }
    );

    await redisClient.set(cacheKey, JSON.stringify(result));

    return result;
  }
);
