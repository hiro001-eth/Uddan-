import type { Request, Response } from 'express';
import { ApplicationCreateSchema, ApplicationQuerySchema, ApplicationUpdateSchema } from './schemas';
import { deleteApplication, getApplication, listApplications } from './repo';
import { createApplicationWithAudit, deleteApplicationWithAudit, updateApplicationWithAudit } from './service';
import { sendCreated, sendNoContent, sendOk } from '../../utils/response';

export async function getApplications(req: Request, res: Response) {
  const query = ApplicationQuerySchema.parse(req.query);
  const { items, total } = await listApplications(query);
  return sendOk(res, { items, total, page: query.page, limit: query.limit });
}

export async function getApplicationById(req: Request, res: Response) {
  const item = await getApplication(req.params.id);
  if (!item) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Application not found' } });
  return sendOk(res, item);
}

export async function postApplication(req: Request, res: Response) {
  const body = ApplicationCreateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string | undefined;
  const item = await createApplicationWithAudit(body, actor);
  return sendCreated(res, item);
}

export async function patchApplication(req: Request, res: Response) {
  const body = ApplicationUpdateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string;
  const item = await updateApplicationWithAudit(req.params.id, body, actor);
  return sendOk(res, item);
}

export async function deleteApplicationCtrl(req: Request, res: Response) {
  const actor = (req as any).user?.sub as string;
  await deleteApplicationWithAudit(req.params.id, actor);
  return sendNoContent(res);
}
