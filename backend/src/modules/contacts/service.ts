import prisma from '../../prisma';

export async function createContactWithAudit(data: any, actorId?: string) {
  const contact = await prisma.$transaction(async (tx) => {
    const created = await tx.contact.create({ data });
    await tx.auditLog.create({ data: { userId: actorId || null, action: 'create', model: 'Contact', modelId: created.id, changesJson: JSON.stringify(data) } });
    return created;
  });
  return contact;
}

export async function updateContactWithAudit(id: string, data: any, actorId?: string) {
  const contact = await prisma.$transaction(async (tx) => {
    const updated = await tx.contact.update({ where: { id }, data });
    await tx.auditLog.create({ data: { userId: actorId || null, action: 'update', model: 'Contact', modelId: id, changesJson: JSON.stringify(data) } });
    return updated;
  });
  return contact;
}

export async function deleteContactWithAudit(id: string, actorId?: string) {
  await prisma.$transaction(async (tx) => {
    await tx.contact.delete({ where: { id } });
    await tx.auditLog.create({ data: { userId: actorId || null, action: 'delete', model: 'Contact', modelId: id } });
  });
}


