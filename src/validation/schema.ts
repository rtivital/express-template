import z from 'zod';

export const IntIdSchema = z.coerce.number('Must be an integer').int('Must be an integer');

export const IdObjectSchema = z.object({ id: IntIdSchema });
