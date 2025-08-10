import type { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';

export function requireRoles(allowedRoleNames: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { sub: string; roleId: string; roleName?: string } | undefined;
    if (!user) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
    let roleName = user.roleName;
    if (!roleName) {
      const role = await prisma.role.findUnique({ where: { id: user.roleId } });
      roleName = role?.name;
      (req as any).user = { ...user, roleName };
    }
    if (!roleName || !allowedRoleNames.includes(roleName)) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient role' } });
    }
    return next();
  };
}
