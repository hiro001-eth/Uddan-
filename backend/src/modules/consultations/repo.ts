import prisma from '../../prisma';
import { getPagination } from '../../utils/pagination';

export async function listConsultations(params: any) {
  const { skip, take } = getPagination(params);
  const [items, total] = await Promise.all([
    prisma.consultation.findMany({ skip, take, orderBy: { date: 'desc' } }),
    prisma.consultation.count(),
  ]);
  return { items, total };
}

export function getConsultation(id: string) {
  return prisma.consultation.findUnique({ where: { id } });
}

export function createConsultation(data: any) {
  return prisma.consultation.create({ data });
}

export function updateConsultation(id: string, data: any) {
  return prisma.consultation.update({ where: { id }, data });
}

export function deleteConsultation(id: string) {
  return prisma.consultation.delete({ where: { id } });
}
