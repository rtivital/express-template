import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true, path: '.env' });

const envSchema = z.object({
  PORT: z.preprocess(Number, z.number()).default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  CORS: z.string().default(''),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug']).default('info'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  SESSION_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
