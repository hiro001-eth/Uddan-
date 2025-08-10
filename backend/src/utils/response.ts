import type { Response } from 'express';

export function sendOk<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ data });
}

export function sendCreated<T>(res: Response, data: T) {
  return sendOk(res, data, 201);
}

export function sendNoContent(res: Response) {
  return res.status(204).send();
}

export function sendError(res: Response, code: string, message: string, status = 400, details?: unknown) {
  return res.status(status).json({ error: { code, message, details } });
}
