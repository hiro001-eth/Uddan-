import prisma from '../../prisma';
import { getOrderBy, getPagination } from '../../utils/pagination';
import type { Prisma } from '@prisma/client';

export async function listUsers(params: any) {
  const { skip, take } = getPagination(params);
  const q = typeof params.q === 'string' && params.q.length > 0 ? params.q : undefined;
  const where: Prisma.UserWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      }
    : {};
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: (getOrderBy(params.sort, params.order) as Prisma.UserOrderByWithRelationInput) || { createdAt: 'desc' },
      include: { role: true },
    }),
    prisma.user.count({ where }),
  ]);
  return { items, total };
}

export function getUser(id: string) {
  return prisma.user.findUnique({ where: { id }, include: { role: true } });
}

export function createUser(data: any) {
  return prisma.user.create({ data });
}

export function updateUser(id: string, data: any) {
  return prisma.user.update({ where: { id }, data });
}

export function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
