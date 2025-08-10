import prisma from '../../prisma';

export async function createConsultationWithAudit(data: any, actorId: string) {
  const item = await prisma.$transaction(async (tx) => {
    const created = await tx.consultation.create({ data });
    await tx.auditLog.create({ data: { userId: actorId, action: 'create', model: 'Consultation', modelId: created.id, changesJson: JSON.stringify(data) } });
    return created;
  });
  return item;
}

export async function updateConsultationWithAudit(id: string, data: any, actorId: string) {
  const item = await prisma.$transaction(async (tx) => {
    const updated = await tx.consultation.update({ where: { id }, data });
    await tx.auditLog.create({ data: { userId: actorId, action: 'update', model: 'Consultation', modelId: id, changesJson: JSON.stringify(data) } });
    return updated;
  });
  return item;
}

export async function deleteConsultationWithAudit(id: string, actorId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.consultation.delete({ where: { id } });
    await tx.auditLog.create({ data: { userId: actorId, action: 'delete', model: 'Consultation', modelId: id } });
  });
}
