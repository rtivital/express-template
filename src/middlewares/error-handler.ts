import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@/errors';
import { logger } from '@/logger';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    logger.info(err, `HTTP error at ${req.originalUrl}`);
    return res.status(err.status).json(err.format());
  }

  if (err instanceof Error) {
    logger.fatal(err, 'Unexpected error');
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  logger.fatal({ err }, 'Unknown error type');
  return res.status(500).json({ error: 'Internal Server Error' });
}
