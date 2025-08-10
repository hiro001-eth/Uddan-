import type { Request, Response } from 'express';
import { UserCreateSchema, UserQuerySchema, UserUpdateSchema } from './schemas';
import { listUsers, getUser } from './repo';
import { createUserWithPassword, updateUserWithAudit, deleteUserWithAudit } from './service';
import { sendCreated, sendNoContent, sendOk } from '../../utils/response';

export async function getUsers(req: Request, res: Response) {
  const query = UserQuerySchema.parse(req.query);
  const { items, total } = await listUsers(query);
  return sendOk(res, { items, total, page: query.page, limit: query.limit });
}

export async function getUserById(req: Request, res: Response) {
  const user = await getUser(req.params.id);
  if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
  return sendOk(res, user);
}

export async function postUser(req: Request, res: Response) {
  const body = UserCreateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string;
  const user = await createUserWithPassword(body, actor);
  return sendCreated(res, user);
}

export async function patchUser(req: Request, res: Response) {
  const body = UserUpdateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string;
  const user = await updateUserWithAudit(req.params.id, body, actor);
  return sendOk(res, user);
}

export async function deleteUserCtrl(req: Request, res: Response) {
  const actor = (req as any).user?.sub as string;
  await deleteUserWithAudit(req.params.id, actor);
  return sendNoContent(res);
}
