import prisma from '../../prisma';

export async function createPageWithVersion(data: any, actorId: string) {
  const page = await prisma.$transaction(async (tx) => {
    const created = await tx.page.create({ data });
    await tx.pageVersion.create({ data: { pageId: created.id, title: created.title, body: created.body, metaTitle: created.metaTitle ?? undefined, metaDesc: created.metaDesc ?? undefined, version: created.version } });
    await tx.auditLog.create({ data: { userId: actorId, action: 'create', model: 'Page', modelId: created.id, changesJson: JSON.stringify(data) } });
    return created;
  });
  return page;
}

export async function updatePageWithVersion(id: string, data: any, actorId: string) {
  const page = await prisma.$transaction(async (tx) => {
    const updated = await tx.page.update({ where: { id }, data: { ...data, version: { increment: 1 } } });
    await tx.pageVersion.create({ data: { pageId: updated.id, title: updated.title, body: updated.body, metaTitle: updated.metaTitle ?? undefined, metaDesc: updated.metaDesc ?? undefined, version: updated.version } });
    await tx.auditLog.create({ data: { userId: actorId, action: 'update', model: 'Page', modelId: updated.id, changesJson: JSON.stringify(data) } });
    return updated;
  });
  return page;
}

export async function deletePageWithAudit(id: string, actorId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.page.delete({ where: { id } });
    await tx.auditLog.create({ data: { userId: actorId, action: 'delete', model: 'Page', modelId: id } });
  });
}
