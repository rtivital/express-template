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
      const parsed = schema.parse(req[property]);

      if (property === 'query') {
        // Express 5 treats req.query as a read-only getter; mutate the object instead of reassigning
        const q = req.query as Record<string, unknown>;
        for (const key of Object.keys(q)) delete q[key];
        Object.assign(q, parsed);
      } else if (property === 'params') {
        // Params is mutable in Express; safe to reassign
        (req as any).params = parsed;
      } else {
        // Body is mutable
        (req as any).body = parsed;
      }
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
