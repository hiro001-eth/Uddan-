import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const VerifyTotpSchema = z.object({
  code: z.string().min(6).max(8),
});

export const ResetRequestSchema = z.object({
  email: z.string().email(),
});

export const ResetConfirmSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});
