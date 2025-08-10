import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  BASE_URL: z.string().default('http://localhost:3000'),
  CORS_ORIGIN: z.string(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().default(900),
  JWT_REFRESH_TTL_SECONDS: z.coerce.number().default(60 * 60 * 24 * 30),
  COOKIE_SECURE: z.string().optional().transform((v) => v === 'true'),
  COOKIE_DOMAIN: z.string().default('localhost'),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  CSRF_COOKIE_NAME: z.string().default('csrfToken'),
  CSRF_HEADER_NAME: z.string().default('x-csrf-token'),
  DATABASE_URL: z.string(),
  PRISMA_LOG_LEVEL: z.string().default('info'),
  SEED_SUPERADMIN_EMAIL: z.string().email().default('admin@uddaanagencies.com'),
  SEED_SUPERADMIN_PASSWORD: z.string().default('ChangeMe_123!'),
  SEED_SUPERADMIN_NAME: z.string().default('Super Admin'),
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_ACCESS_KEY_ID: z.string().default('replace'),
  AWS_SECRET_ACCESS_KEY: z.string().default('replace'),
  S3_BUCKET_NAME: z.string().default('replace'),
  S3_SIGNED_URL_TTL_SECONDS: z.coerce.number().default(900),
  FORCE_HTTPS: z.string().optional().transform((v) => v === 'true'),
  RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().default(15),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RENDER_EXTERNAL_URL: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  /* eslint-disable no-console */
  console.error('Invalid environment variables', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
