import type { Request, Response } from 'express';
import { ContactCreateSchema, ContactQuerySchema, ContactUpdateSchema } from './schemas';
import { deleteContact, getContact, listContacts } from './repo';
import { createContactWithAudit, deleteContactWithAudit, updateContactWithAudit } from './service';
import { sendCreated, sendNoContent, sendOk } from '../../utils/response';

export async function getContacts(req: Request, res: Response) {
  const query = ContactQuerySchema.parse(req.query);
  const { items, total } = await listContacts(query);
  return sendOk(res, { items, total, page: query.page, limit: query.limit });
}

export async function getContactById(req: Request, res: Response) {
  const item = await getContact(req.params.id);
  if (!item) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Contact not found' } });
  return sendOk(res, item);
}

export async function postContact(req: Request, res: Response) {
  const body = ContactCreateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string | undefined;
  const item = await createContactWithAudit(body, actor);
  return sendCreated(res, item);
}

export async function patchContact(req: Request, res: Response) {
  const body = ContactUpdateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string | undefined;
  const item = await updateContactWithAudit(req.params.id, body, actor);
  return sendOk(res, item);
}

export async function deleteContactCtrl(req: Request, res: Response) {
  const actor = (req as any).user?.sub as string | undefined;
  await deleteContactWithAudit(req.params.id, actor);
  return sendNoContent(res);
}


