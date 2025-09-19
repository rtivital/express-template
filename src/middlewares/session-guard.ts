import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { logger } from '@/logger';
import { getUserById } from '@/modules/users/get-user-by-id';

export async function sessionGuard(req: Request<any>, res: Response, next: NextFunction) {
  if (req.session.userId == undefined) {
    logger.info('Session guard rejected the request: no userId');
    res.status(status.UNAUTHORIZED).send({ message: 'Unauthorized' });
    return;
  }

  try {
    const user = await getUserById({ id: req.session.userId });
    if (!user) {
      logger.info('Session guard rejected the request: user not found');
      res.status(status.UNAUTHORIZED).send({ message: 'Unauthorized' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.info(error, 'Session guard rejected the request');
    res.status(status.UNAUTHORIZED).send({ message: 'Unauthorized' });
    return;
  }
}
