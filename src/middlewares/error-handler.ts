import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '@/errors';
import { logger } from '@/logger';

export function errorHandler(error: Error, req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    logger.info(error, `Validation error at ${req.originalUrl}`);
    return res.status(422).json({
      message: 'Validation Error',
      details: error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  if (error instanceof HttpError) {
    logger.info(error, `HTTP error at ${req.originalUrl}`);
    return res.status(error.status).json(error.format());
  }

  if (error instanceof Error) {
    logger.fatal(error, 'Unexpected error');
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  logger.fatal({ err: error }, 'Unknown error type');
  return res.status(500).json({ message: 'Internal Server Error' });
}
