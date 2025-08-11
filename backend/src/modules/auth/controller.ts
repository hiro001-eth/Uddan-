import type { Request, Response } from 'express';
import { LoginSchema, VerifyTotpSchema, ResetRequestSchema, ResetConfirmSchema } from './schemas';
import { login, verify2fa, requestPasswordReset, confirmPasswordReset } from './service';
import { env } from '../../config/env';
import { sendError } from '../../utils/response';

function setCookie(res: Response, name: string, value: string, maxAgeSec: number) {
  res.cookie(name, value, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    domain: env.COOKIE_DOMAIN,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/',
    maxAge: maxAgeSec * 1000,
  });
}

export async function postLogin(req: Request, res: Response) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 'BAD_REQUEST', 'Invalid login payload', 400, parsed.error.format());
  }
  const { email, password } = parsed.data;
  const result = await login(email, password);
  if (!('ok' in result) || !result.ok) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
  setCookie(res, 'refreshToken', result.refreshToken, env.JWT_REFRESH_TTL_SECONDS);
  // Always require 2FA
  return res.json({ mfaRequired: true, otpauthUrl: result.otpauthUrl, user: result.user });
}

export async function postVerify2fa(req: Request, res: Response) {
  const parsed = VerifyTotpSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 'BAD_REQUEST', 'Invalid 2FA payload', 400, parsed.error.format());
  }
  const { code } = parsed.data;
  const user = (req as any).user; // may be undefined
  const userId = user?.sub || (await getUserIdFromRefresh(req));
  if (!userId) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing session' } });
  const result = await verify2fa(userId, code);
  if (!result.ok) return res.status(401).json({ error: { code: result.reason, message: '2FA failed' } });
  setCookie(res, 'accessToken', result.accessToken, env.JWT_ACCESS_TTL_SECONDS);
  setCookie(res, 'refreshToken', result.refreshToken, env.JWT_REFRESH_TTL_SECONDS);
  return res.json({ success: true, roleName: result.roleName });
}

async function getUserIdFromRefresh(req: Request) {
  const rt = req.cookies['refreshToken'];
  if (!rt) return null;
  try {
    const jwt = (await import('../../utils/jwt')).verifyRefreshToken(rt);
    return jwt.sub as string;
  } catch {
    return null;
  }
}

export async function postLogout(_req: Request, res: Response) {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
  return res.status(204).send();
}

export async function postResetRequest(req: Request, res: Response) {
  const parsed = ResetRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 'BAD_REQUEST', 'Invalid payload', 400, parsed.error.format());
  }
  const { email } = parsed.data;
  const token = await requestPasswordReset(email);
  if (env.NODE_ENV === 'production') return res.status(204).send();
  return res.json({ token });
}

export async function postResetConfirm(req: Request, res: Response) {
  const parsed = ResetConfirmSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 'BAD_REQUEST', 'Invalid payload', 400, parsed.error.format());
  }
  const { token, password } = parsed.data;
  const ok = await confirmPasswordReset(token, password);
  if (!ok) return res.status(400).json({ error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } });
  return res.status(204).send();
}
