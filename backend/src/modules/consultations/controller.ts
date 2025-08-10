import type { Request, Response } from 'express';
import { ConsultationCreateSchema, ConsultationQuerySchema, ConsultationUpdateSchema } from './schemas';
import { deleteConsultation, getConsultation, listConsultations } from './repo';
import { createConsultationWithAudit, deleteConsultationWithAudit, updateConsultationWithAudit } from './service';
import { sendCreated, sendNoContent, sendOk } from '../../utils/response';

export async function getConsultations(req: Request, res: Response) {
  const query = ConsultationQuerySchema.parse(req.query);
  const { items, total } = await listConsultations(query);
  return sendOk(res, { items, total, page: query.page, limit: query.limit });
}

export async function getConsultationById(req: Request, res: Response) {
  const item = await getConsultation(req.params.id);
  if (!item) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Consultation not found' } });
  return sendOk(res, item);
}

export async function postConsultation(req: Request, res: Response) {
  const body = ConsultationCreateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string;
  const item = await createConsultationWithAudit(body, actor);
  return sendCreated(res, item);
}

export async function patchConsultation(req: Request, res: Response) {
  const body = ConsultationUpdateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string;
  const item = await updateConsultationWithAudit(req.params.id, body, actor);
  return sendOk(res, item);
}

export async function deleteConsultationCtrl(req: Request, res: Response) {
  const actor = (req as any).user?.sub as string;
  await deleteConsultationWithAudit(req.params.id, actor);
  return sendNoContent(res);
}
