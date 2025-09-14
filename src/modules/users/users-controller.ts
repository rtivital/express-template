import express from 'express';
import status from 'http-status';
import { sessionGuard } from '@/middlewares/session-guard';
import { validateBody } from '@/middlewares/validate-body';
import { prisma } from '@/prisma';
import { CreateUserSchema } from './create-user';
import { getUserByEmail } from './get-user-by-email';

export const UsersController = express.Router();

UsersController.get('/api/v1/users', sessionGuard, async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

UsersController.get('/api/v1/users/email', async (req, res) => {
  const user = await getUserByEmail({ email: req.query.email as string });
  res.json(user);
});

UsersController.post('/api/v1/users', validateBody(CreateUserSchema), async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  req.session.userId = user.id;
  req.user = user;
  res.status(status.CREATED).json(user);
});
