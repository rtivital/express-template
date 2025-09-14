import z from 'zod';
import { Prisma, PrismaClient } from '@/generated/prisma/client';
import { prisma } from '@/prisma';

export function createService<ReturnValue, Schema extends z.ZodObject<any>>(
  inputSchema: Schema,
  handler: (
    input: z.infer<Schema>,
    client: Prisma.TransactionClient | PrismaClient
  ) => Promise<ReturnValue>
) {
  return async (
    input: z.infer<Schema>,
    client: Prisma.TransactionClient | PrismaClient = prisma
  ): Promise<ReturnValue> => {
    const sanitizedInput = inputSchema.parse(input);
    return handler(sanitizedInput, client);
  };
}
