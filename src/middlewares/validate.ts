import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import z, { ZodError } from 'zod';
import { formatZodError } from '@/utils/format-zod-error';

export function validate(
  schema: z.ZodType<unknown>,
  property: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[property]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(status.UNPROCESSABLE_ENTITY).json(formatZodError(error));
      } else {
        res.status(status.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
      }
    }
  };
}
