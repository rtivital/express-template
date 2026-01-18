import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from '@/env';
import { sessionMiddleware } from '@/middlewares/session';
import { openApiSpec } from '@/openapi';
import { prisma } from '@/prisma';
import { httpLogger } from './logger';
import { errorHandler } from './middlewares/error-handler';
import { trailingSlashRedirect } from './middlewares/trailing-slash-redirect';
import { UsersController } from './modules/users/users-controller';

export const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(trailingSlashRedirect);
app.use(httpLogger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

if (env.CORS) {
  app.use(
    cors({
      origin: env.CORS.split(',').map((o) => o.trim()),
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );
}

app.use(sessionMiddleware);

app.get('/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use(UsersController);

app.use(errorHandler);
