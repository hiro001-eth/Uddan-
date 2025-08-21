import prisma from '../../prisma';
import { getOrderBy, getPagination } from '../../utils/pagination';
import type { Prisma } from '@prisma/client';

export async function listEvents(params: any) {
  const { skip, take } = getPagination(params);
  const q = typeof params.q === 'string' && params.q.length > 0 ? params.q : undefined;
  const where: Prisma.EventWhereInput = q ? { title: { contains: q } } : {};
  const [items, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take,
      orderBy: (getOrderBy(params.sort, params.order) as Prisma.EventOrderByWithRelationInput) || { startAt: 'desc' },
    }),
    prisma.event.count({ where }),
  ]);
  return { items, total };
}

export function getEvent(id: string) {
  return prisma.event.findUnique({ where: { id } });
}

export function createEvent(data: any) {
  return prisma.event.create({ data });
}

export function updateEvent(id: string, data: any) {
  return prisma.event.update({ where: { id }, data });
}

export function deleteEvent(id: string) {
  return prisma.event.delete({ where: { id } });
}
