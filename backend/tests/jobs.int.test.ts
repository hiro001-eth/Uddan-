import request from 'supertest';
import { createApp } from '../src/config/express';
import prisma from '../src/prisma';
import { authenticator } from 'otplib';

const app = createApp();

async function loginAndGetAgent() {
  const agent = request.agent(app);
  const csrfRes = await agent.get('/api/auth/csrf');
  const csrfToken = csrfRes.body.data.csrfToken;
  await agent
    .post('/api/auth/login')
    .set('x-csrf-token', csrfToken)
    .send({ email: process.env.SEED_SUPERADMIN_EMAIL || 'admin@uddaanagencies.com', password: process.env.SEED_SUPERADMIN_PASSWORD || 'ChangeMe_123!' });
  const admin = await prisma.user.findUnique({ where: { email: process.env.SEED_SUPERADMIN_EMAIL || 'admin@uddaanagencies.com' } });
  const code = authenticator.generate(admin!.mfaSecret!);
  await agent.post('/api/auth/verify-2fa').set('x-csrf-token', csrfToken).send({ code });
  return { agent, csrfToken };
}

describe('Jobs', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates, lists, updates, and deletes a job', async () => {
    const { agent, csrfToken } = await loginAndGetAgent();

    const createRes = await agent
      .post('/api/jobs')
      .set('x-csrf-token', csrfToken)
      .send({
        title: 'Test Role', company: 'Acme', country: 'Nepal', jobType: 'Full-time', description: 'Desc', contactEmail: 'hr@acme.com', status: 'open'
      });
    expect(createRes.status).toBe(201);
    const id = createRes.body.data.id;

    const listRes = await agent.get('/api/jobs');
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.data.items)).toBe(true);

    const updateRes = await agent
      .patch(`/api/jobs/${id}`)
      .set('x-csrf-token', csrfToken)
      .send({ featured: true });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.featured).toBe(true);

    const delRes = await agent
      .delete(`/api/jobs/${id}`)
      .set('x-csrf-token', csrfToken);
    expect(delRes.status).toBe(204);
  });
});
