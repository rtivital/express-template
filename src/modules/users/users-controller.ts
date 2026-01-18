import express from 'express';
import status from 'http-status';
import { HttpError } from '@/errors';
import { sessionGuard } from '@/middlewares/session-guard';
import { validate } from '@/middlewares/validate';
import { prisma } from '@/prisma';
import { AuditAction, auditLog } from '@/utils/audit-log';
import { IdObjectSchema, PaginationParamsSchema } from '@/validation';
import { deleteUser } from './delete-user';
import { getUserByEmail, GetUserByEmailSchema } from './get-user-by-email';
import { getUserById } from './get-user-by-id';
import { getUsers } from './get-users';
import { updateUser } from './update-user';
import { BaseUserSchema } from './users-schema';

export const UsersController = express.Router();

UsersController.get(
  '/api/v1/users',
  validate(PaginationParamsSchema, 'query'),
  sessionGuard,
  async (req, res) => {
    const users = await getUsers(req.query);
    res.json(users);
  }
);

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

  if (!user) {
    throw new HttpError(status.UNAUTHORIZED, 'Unauthorized');
  }

  res.json(user);
});

UsersController.post('/api/v1/users/login', validate(GetUserByEmailSchema), async (req, res) => {
  const user = await getUserByEmail({ email: req.body.email });

  if (!user) {
    auditLog({
      action: AuditAction.LOGIN_FAILED,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.id?.toString(),
      details: { email: req.body.email },
    });
    res.status(status.NOT_FOUND).json({ message: 'User not found' });
    return;
  }

  req.session.userId = user.id;
  req.user = user;

  auditLog({
    action: AuditAction.USER_LOGIN,
    userId: user.id,
    actorId: user.id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    requestId: req.id?.toString(),
  });

  res.json(user);
});

UsersController.post('/api/v1/users/logout', sessionGuard, async (req, res) => {
  const userId = req.session.userId;

  req.session.destroy((err) => {
    if (err) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ message: 'Could not log out' });
      return;
    }

    if (userId) {
      auditLog({
        action: AuditAction.USER_LOGOUT,
        userId,
        actorId: userId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        requestId: req.id?.toString(),
      });
    }

    res.json({ message: 'Logged out' });
  });
});

UsersController.post('/api/v1/users', validate(BaseUserSchema), async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  req.session.userId = user.id;
  req.user = user;

  auditLog({
    action: AuditAction.USER_CREATED,
    userId: user.id,
    actorId: user.id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    requestId: req.id?.toString(),
    details: { email: user.email },
  });

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

    auditLog({
      action: AuditAction.USER_UPDATED,
      userId: user.id,
      actorId: req.session.userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.id?.toString(),
      details: { updatedFields: Object.keys(req.body) },
    });

    res.json(user);
  }
);

UsersController.delete(
  '/api/v1/users/:id',
  validate(IdObjectSchema, 'params'),
  sessionGuard,
  async (req, res) => {
    const user = await deleteUser({ id: req.params.id });

    auditLog({
      action: AuditAction.USER_DELETED,
      userId: user.id,
      actorId: req.session.userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      requestId: req.id?.toString(),
      details: { email: user.email },
    });

    res.json(user);
  }
);
