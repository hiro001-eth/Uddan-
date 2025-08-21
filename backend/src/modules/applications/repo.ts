import prisma from '../../prisma';
import { getOrderBy, getPagination } from '../../utils/pagination';
import type { Prisma } from '@prisma/client';

export async function listApplications(params: any) {
  const { skip, take } = getPagination(params);
  const q = typeof params.q === 'string' && params.q.length > 0 ? params.q : undefined;
  const where: Prisma.ApplicationWhereInput = q
    ? {
        OR: [
          { candidateName: { contains: q } },
          { candidateEmail: { contains: q } },
        ],
      }
    : {};
  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take,
      orderBy: (getOrderBy(params.sort, params.order) as Prisma.ApplicationOrderByWithRelationInput) || { appliedAt: 'desc' },
    }),
    prisma.application.count({ where }),
  ]);
  return { items, total };
}

export function getApplication(id: string) {
  return prisma.application.findUnique({ where: { id } });
}

export function createApplication(data: any) {
  return prisma.application.create({ data });
}

export function updateApplication(id: string, data: any) {
  return prisma.application.update({ where: { id }, data });
}

export function deleteApplication(id: string) {
  return prisma.application.delete({ where: { id } });
}
