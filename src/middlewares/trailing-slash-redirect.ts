import { NextFunction, Request, Response } from 'express';

export function trailingSlashRedirect(req: Request, res: Response, next: NextFunction) {
  const originalUrl = req.originalUrl;

  if (originalUrl.length > 1 && originalUrl.endsWith('/')) {
    const newUrl = originalUrl.slice(0, -1);
    return res.redirect(301, newUrl);
  }

  next();
}
