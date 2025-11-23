import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seeds/index.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
