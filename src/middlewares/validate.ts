import { NextFunction, Request, RequestHandler, Response } from 'express';
import status from 'http-status';
import { z, ZodError, ZodType } from 'zod';
import { formatZodError } from '@/utils/format-zod-error';

export function validate<T extends ZodType<any, any, any>, K extends 'body' | 'query' | 'params'>(
  schema: T,
  property: K = 'body' as K
): RequestHandler<
  K extends 'params' ? z.infer<T> : any,
  any,
  K extends 'body' ? z.infer<T> : any,
  K extends 'query' ? z.infer<T> : any
> {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req[property] = schema.parse(req[property]);
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
