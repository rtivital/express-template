import z from 'zod';

export const intId = z.coerce.number('Must be an integer').int('Must be an integer');

export const idSchema = z.object({ id: intId });
