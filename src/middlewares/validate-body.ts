import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import z, { ZodError } from 'zod/v4';

export function validateBody(schema: z.ZodType<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        res
          .status(status.UNPROCESSABLE_ENTITY)
          .json({ error: 'Invalid data', details: errorMessages });
      } else {
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
      }
    }
  };
}
