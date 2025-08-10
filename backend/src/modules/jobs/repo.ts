import prisma from '../../prisma';
import { getOrderBy, getPagination } from '../../utils/pagination';
import type { Prisma } from '@prisma/client';

export async function listJobs(params: any) {
  const { skip, take } = getPagination(params);
  const q = typeof params.q === 'string' && params.q.length > 0 ? params.q : undefined;
  const whereAnd: Prisma.JobWhereInput[] = [];
  if (q) {
    whereAnd.push({ OR: [
      { title: { contains: q, mode: 'insensitive' } },
      { company: { contains: q, mode: 'insensitive' } },
      { country: { contains: q, mode: 'insensitive' } },
      { city: { contains: q, mode: 'insensitive' } },
    ] });
  }
  if (params.country) {
    whereAnd.push({ country: { equals: String(params.country) } });
  }
  if (params.status) {
    whereAnd.push({ status: String(params.status) });
  }
  const where: Prisma.JobWhereInput = whereAnd.length > 0 ? { AND: whereAnd } : {};
  const [items, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take,
      orderBy: (getOrderBy(params.sort, params.order) as Prisma.JobOrderByWithRelationInput) || { createdAt: 'desc' },
    }),
    prisma.job.count({ where }),
  ]);
  return { items, total };
}

export function getJob(id: string) {
  return prisma.job.findUnique({ where: { id } });
}

export function createJob(data: any) {
  return prisma.job.create({ data });
}

export function updateJob(id: string, data: any) {
  return prisma.job.update({ where: { id }, data });
}

export function deleteJob(id: string) {
  return prisma.job.delete({ where: { id } });
}
