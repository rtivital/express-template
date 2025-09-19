import express from 'express';
import status from 'http-status';
import { HttpError } from '@/errors';
import { sessionGuard } from '@/middlewares/session-guard';
import { validate } from '@/middlewares/validate';
import { prisma } from '@/prisma';
import { IdObjectSchema } from '@/validation';
import { BaseUserSchema } from './create-user';
import { getUserByEmail, GetUserByEmailSchema } from './get-user-by-email';
import { getUserById } from './get-user-by-id';
import { updateUser } from './update-user';

export const UsersController = express.Router();

UsersController.get('/api/v1/users', sessionGuard, async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

UsersController.get(
  '/api/v1/users/:id',
  validate(IdObjectSchema, 'params'),
  sessionGuard,
  async (req, res) => {
    const user = await getUserById({ id: req.params.id });

    if (!user) {
      throw new HttpError(status.NOT_FOUND, 'User not found');
    }

    res.json(user);
  }
);

UsersController.get('/api/v1/users/me', sessionGuard, async (req, res) => {
  if (!req.session.userId) {
    throw new HttpError(status.UNAUTHORIZED, 'Unauthorized');
  }

  const user = await getUserById({ id: req.session.userId });

  if (!req.session.userId) {
    throw new HttpError(status.UNAUTHORIZED, 'Unauthorized');
  }

  res.json(user);
});

UsersController.post('/api/v1/users/login', validate(GetUserByEmailSchema), async (req, res) => {
  const user = await getUserByEmail({ email: req.body.email });

  if (!user) {
    res.status(status.NOT_FOUND).json({ message: 'User not found' });
    return;
  }

  req.session.userId = user.id;
  req.user = user;
  res.json(user);
});

UsersController.post('/api/v1/users/logout', sessionGuard, async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ message: 'Could not log out' });
      return;
    }

    res.json({ message: 'Logged out' });
  });
});

UsersController.post('/api/v1/users', validate(BaseUserSchema), async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  req.session.userId = user.id;
  req.user = user;
  res.status(status.CREATED).json(user);
});

UsersController.put(
  '/api/v1/users/:id',
  validate(BaseUserSchema, 'body'),
  validate(IdObjectSchema, 'params'),
  sessionGuard,
  async (req, res) => {
    const user = await updateUser({ id: req.params.id, ...req.body });

    if (!user) {
      throw new HttpError(status.NOT_FOUND, 'User not found');
    }

    res.json(user);
  }
);
