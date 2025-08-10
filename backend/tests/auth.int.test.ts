import request from 'supertest';
import { createApp } from '../src/config/express';
import prisma from '../src/prisma';
import { authenticator } from 'otplib';

const app = createApp();

describe('Auth', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('logs in and verifies 2FA', async () => {
    const agent = request.agent(app);

    // Fetch CSRF token cookie first
    const csrfRes = await agent.get('/api/auth/csrf');
    const csrfToken = csrfRes.body.data.csrfToken;

    const loginRes = await agent
      .post('/api/auth/login')
      .set('x-csrf-token', csrfToken)
      .send({ email: process.env.SEED_SUPERADMIN_EMAIL || 'admin@uddaanagencies.com', password: process.env.SEED_SUPERADMIN_PASSWORD || 'ChangeMe_123!' });

    expect(loginRes.status).toBe(200);

    const admin = await prisma.user.findUnique({ where: { email: process.env.SEED_SUPERADMIN_EMAIL || 'admin@uddaanagencies.com' } });
    expect(admin?.mfaSecret).toBeTruthy();
    const code = authenticator.generate(admin!.mfaSecret!);

    const verifyRes = await agent
      .post('/api/auth/verify-2fa')
      .set('x-csrf-token', csrfToken)
      .send({ code });

    expect(verifyRes.status).toBe(200);
  });
});
