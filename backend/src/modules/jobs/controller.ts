import type { Request, Response } from 'express';
import { JobCreateSchema, JobQuerySchema, JobUpdateSchema } from './schemas';
import { deleteJob, getJob, listJobs } from './repo';
import { createJobWithAudit, deleteJobWithAudit, exportJobsCsv, importJobsCsv, updateJobWithAudit } from './service';
import { sendCreated, sendNoContent, sendOk } from '../../utils/response';

export async function getJobs(req: Request, res: Response) {
  const query = JobQuerySchema.parse(req.query);
  const { items, total } = await listJobs(query);
  return sendOk(res, { items, total, page: query.page, limit: query.limit });
}

export async function getJobById(req: Request, res: Response) {
  const job = await getJob(req.params.id);
  if (!job) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Job not found' } });
  return sendOk(res, job);
}

export async function postJob(req: Request, res: Response) {
  const body = JobCreateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string;
  const job = await createJobWithAudit({ ...body, createdBy: actor }, actor);
  return sendCreated(res, job);
}

export async function patchJob(req: Request, res: Response) {
  const body = JobUpdateSchema.parse(req.body);
  const actor = (req as any).user?.sub as string;
  const job = await updateJobWithAudit(req.params.id, body, actor);
  return sendOk(res, job);
}

export async function deleteJobCtrl(req: Request, res: Response) {
  const actor = (req as any).user?.sub as string;
  await deleteJobWithAudit(req.params.id, actor);
  return sendNoContent(res);
}

export async function exportJobs(req: Request, res: Response) {
  const csv = await exportJobsCsv();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="jobs.csv"');
  return res.send(csv);
}

export async function importJobs(req: Request, res: Response) {
  const actor = (req as any).user?.sub as string;
  const count = await importJobsCsv(req.body.csv as string, actor);
  return sendOk(res, { imported: count });
}
