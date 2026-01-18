import z from 'zod';

export const IntIdSchema = z.coerce.number('Must be an integer').int('Must be an integer').openapi({
  description: 'Integer ID',
  example: 1,
});

export const IdObjectSchema = z
  .object({
    id: IntIdSchema,
  })
  .openapi({
    description: 'Object with ID parameter',
  });

export const PaginationParamsSchema = z
  .object({
    page: z.number().int().min(1).optional().openapi({
      description: 'Page number',
      example: 1,
      default: 1,
    }),
    pageSize: z.number().int().min(1).max(100).optional().openapi({
      description: 'Number of items per page',
      example: 10,
      default: 10,
    }),
  })
  .openapi({
    description: 'Pagination parameters',
  });
