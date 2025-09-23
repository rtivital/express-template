import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from '@/env';
import { sessionMiddleware } from '@/middlewares/session';
import { prisma } from '@/prisma';
import { httpLogger } from './logger';
import { errorHandler } from './middlewares/error-handler';
import { trailingSlashRedirect } from './middlewares/trailing-slash-redirect';
import { UsersController } from './modules/users/users-controller';
import { setupSwagger } from './swagger';

export const app = express();

app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(trailingSlashRedirect);
app.use(httpLogger);

if (env.CORS) {
  app.use(cors({ origin: env.CORS.split(','), credentials: true }));
}

app.use(sessionMiddleware);

// Setup Swagger documentation
setupSwagger(app);

app.get('/health', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json({ message: 'ok', users });
});

app.use(UsersController);

app.use(errorHandler);
