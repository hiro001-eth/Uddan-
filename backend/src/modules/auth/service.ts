import prisma from '../../prisma';
import { comparePassword, hashPassword } from '../../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { authenticator } from 'otplib';
import crypto from 'crypto';
import { env } from '../../config/env';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
  if (!user || !user.isActive) return { ok: false as const, reason: 'INVALID_CREDENTIALS' };
  const match = await comparePassword(password, user.passwordHash);
  if (!match) return { ok: false as const, reason: 'INVALID_CREDENTIALS' };

  const refreshToken = signRefreshToken({ sub: user.id, roleId: user.roleId, roleName: user.role.name, mfaVerified: false });

  // Ensure user has MFA secret
  let mfaSecret = user.mfaSecret;
  if (!mfaSecret) {
    mfaSecret = authenticator.generateSecret();
    await prisma.user.update({ where: { id: user.id }, data: { mfaSecret, lastLogin: new Date() } });
  } else {
    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
  }

  const otpauth = authenticator.keyuri(user.email, 'Uddaan Agencies Admin', mfaSecret);

  return {
    ok: true as const,
    refreshToken,
    mfaRequired: true,
    otpauthUrl: otpauth,
    user: { id: user.id, name: user.name, email: user.email, roleName: user.role.name },
  };
}

export async function verify2fa(userId: string, code: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
  if (!user || !user.mfaSecret) return { ok: false as const, reason: 'NO_MFA' };
  // Allow a simple development override code to unblock local auth
  const devBypass = env.NODE_ENV !== 'production' && code === '000000';
  const valid = devBypass || authenticator.verify({ token: code, secret: user.mfaSecret });
  if (!valid) return { ok: false as const, reason: 'INVALID_TOTP' };
  const accessToken = signAccessToken({ sub: user.id, roleId: user.roleId, roleName: user.role.name, mfaVerified: true });
  const refreshToken = signRefreshToken({ sub: user.id, roleId: user.roleId, roleName: user.role.name, mfaVerified: true });
  return { ok: true as const, accessToken, refreshToken, roleName: user.role.name };
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return; // Do not reveal
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
  await prisma.resetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
  if (env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('Password reset token (dev only):', token);
  }
  return token; // for tests
}

export async function confirmPasswordReset(token: string, newPassword: string) {
  const tokenHash = hashToken(token);
  const rec = await prisma.resetToken.findFirst({ where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } } });
  if (!rec) return false;
  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: rec.userId }, data: { passwordHash } }),
    prisma.resetToken.update({ where: { id: rec.id }, data: { usedAt: new Date() } }),
  ]);
  return true;
}

// Express handlers kept here to avoid a new controller file for two endpoints
import type { Request, Response } from 'express';
import { z } from 'zod';

export async function postRefresh(req: Request, res: Response) {
  const rt = req.cookies['refreshToken'];
  if (!rt) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No refresh token' } });
  try {
    const payload = verifyRefreshToken(rt);
    const accessToken = signAccessToken({ sub: String(payload.sub), roleId: String(payload.roleId), roleName: payload.roleName, mfaVerified: true });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      domain: env.COOKIE_DOMAIN,
      sameSite: env.COOKIE_SAME_SITE,
      path: '/',
      maxAge: env.JWT_ACCESS_TTL_SECONDS * 1000,
    });
    return res.json({ ok: true });
  } catch {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid refresh token' } });
  }
}

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  roleId: z.string().uuid(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function postRegisterStaff(req: Request, res: Response) {
  try {
    const body = RegisterSchema.parse(req.body);
    const actor = (req as any).user?.sub as string;
    const passwordHash = await hashPassword(body.password);
    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: body.name,
          email: body.email,
          passwordHash,
          roleId: body.roleId,
          phone: body.phone,
          isActive: body.isActive ?? true,
        },
      });
      await tx.auditLog.create({ data: { userId: actor, action: 'create', model: 'User', modelId: user.id, changesJson: JSON.stringify({ name: user.name, email: user.email, roleId: user.roleId }) } });
      return user;
    });
    return res.status(201).json({ data: created });
  } catch (e: any) {
    return res.status(400).json({ error: { code: 'BAD_REQUEST', message: e?.message || 'Invalid data' } });
  }
}
