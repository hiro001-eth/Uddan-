import prisma from '../../prisma';
import { comparePassword, hashPassword } from '../../utils/password';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
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
  const valid = authenticator.verify({ token: code, secret: user.mfaSecret });
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
