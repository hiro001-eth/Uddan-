import prisma from '../../prisma';

export async function createApplicationWithAudit(data: any, actorId?: string) {
  const app = await prisma.$transaction(async (tx) => {
    const created = await tx.application.create({ data });
    await tx.auditLog.create({ data: { userId: actorId || null, action: 'create', model: 'Application', modelId: created.id, changesJson: JSON.stringify(data) } });
    return created;
  });
  return app;
}

export async function updateApplicationWithAudit(id: string, data: any, actorId?: string) {
  const app = await prisma.$transaction(async (tx) => {
    const updated = await tx.application.update({ where: { id }, data });
    await tx.auditLog.create({ data: { userId: actorId || null, action: 'update', model: 'Application', modelId: id, changesJson: JSON.stringify(data) } });
    return updated;
  });
  return app;
}

export async function deleteApplicationWithAudit(id: string, actorId?: string) {
  await prisma.$transaction(async (tx) => {
    await tx.application.delete({ where: { id } });
    await tx.auditLog.create({ data: { userId: actorId || null, action: 'delete', model: 'Application', modelId: id } });
  });
}
