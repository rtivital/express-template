import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { ZodError } from 'zod';
import { HttpError } from '@/errors';
import { logger } from '@/logger';
import { formatZodError } from '@/utils/format-zod-error';

export function errorHandler(error: Error, req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    logger.info(error, `Validation error at ${req.originalUrl}`);
    return res.status(status.UNPROCESSABLE_ENTITY).json(formatZodError(error));
  }

  if (error instanceof HttpError) {
    logger.info(error, `HTTP error at ${req.originalUrl}`);
    return res.status(error.status).json(error.format());
  }

  if (error instanceof Error) {
    logger.fatal(error, 'Unexpected error');
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }

  logger.fatal({ err: error }, 'Unknown error type');
  return res.status(status.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
}
