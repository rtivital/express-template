import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

export function trailingSlashRedirect(req: Request, res: Response, next: NextFunction) {
  const originalUrl = req.originalUrl;

  if (originalUrl.length > 1 && originalUrl.endsWith('/')) {
    const newUrl = originalUrl.slice(0, -1);
    return res.redirect(status.TEMPORARY_REDIRECT, newUrl);
  }

  next();
}
