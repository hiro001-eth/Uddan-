import type { Request, Response } from 'express';
import { PageCreateSchema, PageQuerySchema, PageUpdateSchema } from './schemas';
import { deletePage, getPage, listPages } from './repo';
import { createPageWithVersion, deletePageWithAudit, updatePageWithVersion } from './service';
import { sendCreated, sendNoContent, sendOk } from '../../utils/response';

export async function getPages(req: Request, res: Response) {
  const query = PageQuerySchema.parse(req.query);
  const { items, total } = await listPages(query);
  return sendOk(res, { items, total, page: query.page, limit: query.limit });
}

export async function getPageById(req: Request, res: Response) {
  const page = await getPage(req.params.id);
  if (!page) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Page not found' } });
  return sendOk(res, page);
}

export async function postPage(req: Request, res: Response) {
  const body = PageCreateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string;
  const page = await createPageWithVersion({ ...body, authorId: actor }, actor);
  return sendCreated(res, page);
}

export async function patchPage(req: Request, res: Response) {
  const body = PageUpdateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string;
  const page = await updatePageWithVersion(req.params.id, body, actor);
  return sendOk(res, page);
}

export async function deletePageCtrl(req: Request, res: Response) {
  const actor = (req as any).user?.sub as string;
  await deletePageWithAudit(req.params.id, actor);
  return sendNoContent(res);
}
