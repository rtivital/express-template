import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

const IGNORED_PATHS = ['/docs'];

export function trailingSlashRedirect(req: Request, res: Response, next: NextFunction) {
  const originalUrl = req.originalUrl;

  if (IGNORED_PATHS.some((path) => originalUrl.startsWith(path))) {
    return next();
  }

  if (originalUrl.length > 1 && originalUrl.endsWith('/')) {
    const newUrl = originalUrl.slice(0, -1);
    return res.redirect(status.TEMPORARY_REDIRECT, newUrl);
  }

  next();
}
