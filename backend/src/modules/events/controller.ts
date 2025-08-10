import type { Request, Response } from 'express';
import { EventCreateSchema, EventQuerySchema, EventUpdateSchema } from './schemas';
import { deleteEvent, getEvent, listEvents } from './repo';
import { createEventWithAudit, deleteEventWithAudit, updateEventWithAudit } from './service';
import { sendCreated, sendNoContent, sendOk } from '../../utils/response';

export async function getEvents(req: Request, res: Response) {
  const query = EventQuerySchema.parse(req.query);
  const { items, total } = await listEvents(query);
  return sendOk(res, { items, total, page: query.page, limit: query.limit });
}

export async function getEventById(req: Request, res: Response) {
  const evt = await getEvent(req.params.id);
  if (!evt) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Event not found' } });
  return sendOk(res, evt);
}

export async function postEvent(req: Request, res: Response) {
  const body = EventCreateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string;
  const evt = await createEventWithAudit({ ...body, createdBy: actor }, actor);
  return sendCreated(res, evt);
}

export async function patchEvent(req: Request, res: Response) {
  const body = EventUpdateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string;
  const evt = await updateEventWithAudit(req.params.id, body, actor);
  return sendOk(res, evt);
}

export async function deleteEventCtrl(req: Request, res: Response) {
  const actor = (req as any).user?.sub as string;
  await deleteEventWithAudit(req.params.id, actor);
  return sendNoContent(res);
}
