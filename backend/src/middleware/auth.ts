import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export function authRequired(requireMfa = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['accessToken'];
    if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing token' } });
    try {
      const payload = verifyAccessToken(token);
      (req as any).user = payload;
      if (requireMfa && !payload.mfaVerified) {
        return res.status(401).json({ error: { code: 'MFA_REQUIRED', message: 'Complete 2FA verification' } });
      }
      return next();
    } catch (e) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
    }
  };
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies['accessToken'];
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    (req as any).user = payload;
  } catch {}
  next();
}
