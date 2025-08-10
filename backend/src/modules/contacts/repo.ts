import prisma from '../../prisma';
import { getOrderBy, getPagination } from '../../utils/pagination';
import type { Prisma } from '@prisma/client';

export async function listContacts(params: any) {
  const { skip, take } = getPagination(params);
  const q = typeof params.q === 'string' && params.q.length > 0 ? params.q : undefined;
  const whereAnd: Prisma.ContactWhereInput[] = [];
  if (q) {
    whereAnd.push({ OR: [
      { fullName: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
    ] });
  }
  if (params.status) whereAnd.push({ status: String(params.status) });
  const where: Prisma.ContactWhereInput = whereAnd.length > 0 ? { AND: whereAnd } : {};
  const [items, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip,
      take,
      orderBy: (getOrderBy(params.sort, params.order) as Prisma.ContactOrderByWithRelationInput) || { createdAt: 'desc' },
    }),
    prisma.contact.count({ where }),
  ]);
  return { items, total };
}

export function getContact(id: string) {
  return prisma.contact.findUnique({ where: { id } });
}

export function createContact(data: any) {
  return prisma.contact.create({ data });
}

export function updateContact(id: string, data: any) {
  return prisma.contact.update({ where: { id }, data });
}

export function deleteContact(id: string) {
  return prisma.contact.delete({ where: { id } });
}


