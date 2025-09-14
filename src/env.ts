import { z } from 'zod';

const envSchema = z.object({
  PORT: z.preprocess(Number, z.number()).default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  CORS: z.string().default(''),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug']).default('info'),
});

export const env = envSchema.parse(process.env);
