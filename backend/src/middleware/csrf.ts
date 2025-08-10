import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import crypto from 'crypto';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function csrfMiddleware(req: Request, res: Response, next: NextFunction) {
  const cookieName = env.CSRF_COOKIE_NAME;
  const headerName = env.CSRF_HEADER_NAME.toLowerCase();

  if (!req.cookies[cookieName]) {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie(cookieName, token, {
      httpOnly: false,
      sameSite: env.COOKIE_SAME_SITE,
      secure: env.COOKIE_SECURE,
      domain: env.COOKIE_DOMAIN,
      path: '/',
    });
  }

  if (SAFE_METHODS.has(req.method)) return next();

  const tokenFromCookie = req.cookies[cookieName];
  const tokenFromHeader = (req.headers[headerName] as string) || '';

  if (!tokenFromCookie || !tokenFromHeader || tokenFromCookie !== tokenFromHeader) {
    return res.status(403).json({ error: { code: 'CSRF_ERROR', message: 'Invalid CSRF token' } });
  }
  return next();
}
