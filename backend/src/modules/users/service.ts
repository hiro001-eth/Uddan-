import { hashPassword } from '../../utils/password';
import prisma from '../../prisma';

export async function createUserWithPassword(data: any, actorId: string) {
  const passwordHash = await hashPassword(data.password);
  const created = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { name: data.name, email: data.email, passwordHash, phone: data.phone, roleId: data.roleId, isActive: data.isActive ?? true } });
    await tx.auditLog.create({ data: { userId: actorId, action: 'create', model: 'User', modelId: user.id, changesJson: JSON.stringify({ name: user.name, email: user.email }) } });
    return user;
  });
  return created;
}

export async function updateUserWithAudit(id: string, data: any, actorId: string) {
  const updated = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({ where: { id }, data });
    await tx.auditLog.create({ data: { userId: actorId, action: 'update', model: 'User', modelId: user.id, changesJson: JSON.stringify(data) } });
    return user;
  });
  return updated;
}

export async function deleteUserWithAudit(id: string, actorId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.user.delete({ where: { id } });
    await tx.auditLog.create({ data: { userId: actorId, action: 'delete', model: 'User', modelId: id } });
  });
}
