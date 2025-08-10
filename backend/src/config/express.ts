import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env, isProd } from './env';
import { apiRateLimiter } from '../middleware/rateLimit';
import { csrfMiddleware } from '../middleware/csrf';
import { requestIdMiddleware } from '../middleware/requestId';
import { mountSwagger } from './swagger';
import routes from '../routes';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(cookieParser());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(requestIdMiddleware);
  app.use(morgan(isProd ? 'combined' : 'dev'));

  app.use('/health', (_req, res) => res.json({ status: 'ok' }));

  // Rate limit and CSRF for state-changing routes
  app.use(apiRateLimiter);
  app.use(csrfMiddleware);

  mountSwagger(app);
  app.use('/api', routes);

  // 404
  app.use((_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not found' } }));

  // Error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: { code: 'INTERNAL', message } });
  });

  return app;
}
