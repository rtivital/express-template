import { User } from '@/generated/prisma/client';
import { createService } from '@/utils/create-service';
import { paginate, PaginatedResult } from '@/utils/paginate';
import { PaginationParamsSchema } from '@/validation';

export const getUsers = createService(
  PaginationParamsSchema,
  async (input, prisma): Promise<PaginatedResult<User>> => {
    return paginate(prisma.user, { where: {} }, { page: input.page, pageSize: input.pageSize });
  }
);
