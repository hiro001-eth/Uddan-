import { PrismaClient } from '@prisma/client';
import { env } from './config/env';

const prisma = new PrismaClient({
  log: env.PRISMA_LOG_LEVEL === 'info' ? ['error', 'warn'] : ['query', 'error', 'warn'],
});

export default prisma;
