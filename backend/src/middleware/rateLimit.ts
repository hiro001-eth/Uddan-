import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const rateLimitMiddleware = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});

// Backward-compatible alias (if other files referenced the old name)
export const apiRateLimiter = rateLimitMiddleware;
