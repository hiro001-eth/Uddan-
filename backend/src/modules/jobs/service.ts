import prisma from '../../prisma';
import { Parser } from 'json2csv';

export async function createJobWithAudit(data: any, actorId?: string) {
  const job = await prisma.$transaction(async (tx) => {
    const created = await tx.job.create({ data });
    await tx.auditLog.create({ data: { userId: actorId || null, action: 'create', model: 'Job', modelId: created.id, changesJson: JSON.stringify(data) } });
    return created;
  });
  return job;
}

export async function updateJobWithAudit(id: string, data: any, actorId?: string) {
  const job = await prisma.$transaction(async (tx) => {
    const updated = await tx.job.update({ where: { id }, data });
    await tx.auditLog.create({ data: { userId: actorId || null, action: 'update', model: 'Job', modelId: id, changesJson: JSON.stringify(data) } });
    return updated;
  });
  return job;
}

export async function deleteJobWithAudit(id: string, actorId?: string) {
  await prisma.$transaction(async (tx) => {
    await tx.job.delete({ where: { id } });
    await tx.auditLog.create({ data: { userId: actorId || null, action: 'delete', model: 'Job', modelId: id } });
  });
}

export async function exportJobsCsv() {
  const jobs = await prisma.job.findMany();
  const parser = new Parser();
  const csv = parser.parse(jobs);
  return csv;
}

export async function importJobsCsv(csvText: string, actorId: string) {
  const lines = csvText.trim().split('\n');
  const header = lines.shift();
  if (!header) return 0;
  const cols = header.split(',');
  const idx = (name: string) => cols.indexOf(name);
  let count = 0;
  await prisma.$transaction(async (tx) => {
    for (const line of lines) {
      const values = line.split(',');
      const data = {
        title: values[idx('title')],
        company: values[idx('company')],
        country: values[idx('country')],
        city: values[idx('city')] || null,
        jobType: values[idx('jobType')],
        salaryMin: values[idx('salaryMin')] ? Number(values[idx('salaryMin')]) : null,
        salaryMax: values[idx('salaryMax')] ? Number(values[idx('salaryMax')]) : null,
        description: values[idx('description')],
        requirements: values[idx('requirements')] || null,
        benefits: values[idx('benefits')] || null,
        contactEmail: values[idx('contactEmail')],
        status: values[idx('status')] || 'draft',
        featured: values[idx('featured')] === 'true',
        createdBy: actorId,
      } as any;
      await tx.job.create({ data });
      count++;
    }
  });
  return count;
}
