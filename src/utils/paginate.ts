export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function paginate<Model, Args extends { where?: any; orderBy?: any }>(
  modelDelegate: {
    findMany(args: Args & { skip: number; take: number }): Promise<Model[]>;
    count(args?: { where?: Args['where'] }): Promise<number>;
  },
  args: Args,
  { page = 1, pageSize = 10 }: PaginationParams
): Promise<PaginatedResult<Model>> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, Math.min(pageSize, 100));

  const total = await modelDelegate.count({ where: args.where });
  const skip = (safePage - 1) * safePageSize;

  const data = await modelDelegate.findMany({
    ...args,
    skip,
    take: safePageSize,
  });

  return {
    data,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.ceil(total / safePageSize),
  };
}
