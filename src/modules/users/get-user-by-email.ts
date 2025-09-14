import z from 'zod';

const GetUserByEmailSchema = z.object({
  email: z.email(),
});

export function getUserByEmail(input: z.infer<typeof GetUserByEmailSchema>) {
  const sanitizedInput = GetUserByEmailSchema.parse(input);
  return { email: sanitizedInput.email };
}
