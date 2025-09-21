import z from 'zod';

export const IntIdSchema = z.coerce.number('Must be an integer').int('Must be an integer');

export const IdObjectSchema = z.object({ id: IntIdSchema });

export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});
