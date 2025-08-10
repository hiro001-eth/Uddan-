import prisma from '../../prisma';
import { getOrderBy, getPagination } from '../../utils/pagination';
import type { Prisma } from '@prisma/client';

export async function listPages(params: any) {
  const { skip, take } = getPagination(params);
  const q = typeof params.q === 'string' && params.q.length > 0 ? params.q : undefined;
  const where: Prisma.PageWhereInput = q
    ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { slug: { contains: q, mode: 'insensitive' } }] }
    : {};
  const [items, total] = await Promise.all([
    prisma.page.findMany({
      where,
      skip,
      take,
      orderBy: (getOrderBy(params.sort, params.order) as Prisma.PageOrderByWithRelationInput) || { createdAt: 'desc' },
    }),
    prisma.page.count({ where }),
  ]);
  return { items, total };
}

export function getPage(id: string) {
  return prisma.page.findUnique({ where: { id } });
}

export function createPage(data: any) {
  return prisma.page.create({ data });
}

export function updatePage(id: string, data: any) {
  return prisma.page.update({ where: { id }, data });
}

export function deletePage(id: string) {
  return prisma.page.delete({ where: { id } });
}
