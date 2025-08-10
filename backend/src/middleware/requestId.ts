import { randomUUID } from 'crypto';
import { withRequestId } from '../utils/logger';
import type { Request, Response, NextFunction } from 'express';

declare global {
  // eslint-disable-next-line no-var
  var getRequestLogger: (req: Request) => ReturnType<typeof withRequestId>;
}

export function requestIdMiddleware(req: Request, _res: Response, next: NextFunction) {
  const rid = req.headers['x-request-id']?.toString() || randomUUID();
  (req as any).requestId = rid;
  (req as any).logger = withRequestId(rid);
  next();
}

export function getLogger(req: Request) {
  return (req as any).logger as ReturnType<typeof withRequestId>;
}
