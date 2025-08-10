import prisma from '../../prisma';

export async function createEventWithAudit(data: any, actorId: string) {
  const event = await prisma.$transaction(async (tx) => {
    const created = await tx.event.create({ data });
    await tx.auditLog.create({ data: { userId: actorId, action: 'create', model: 'Event', modelId: created.id, changesJson: JSON.stringify(data) } });
    return created;
  });
  return event;
}

export async function updateEventWithAudit(id: string, data: any, actorId: string) {
  const event = await prisma.$transaction(async (tx) => {
    const updated = await tx.event.update({ where: { id }, data });
    await tx.auditLog.create({ data: { userId: actorId, action: 'update', model: 'Event', modelId: id, changesJson: JSON.stringify(data) } });
    return updated;
  });
  return event;
}

export async function deleteEventWithAudit(id: string, actorId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.event.delete({ where: { id } });
    await tx.auditLog.create({ data: { userId: actorId, action: 'delete', model: 'Event', modelId: id } });
  });
}
