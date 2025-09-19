import z from 'zod';

export const BaseUserSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  name: z
    .string({ error: 'Name must be a string' })
    .min(2, { error: 'Must be at least 2 characters' })
    .max(100, { error: 'Must be at most 100 characters' }),
});
