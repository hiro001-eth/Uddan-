import { Router } from 'express';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import prisma from '../../prisma';

const router = Router();

router.use(authRequired(true));

router.get('/', requireRoles(['super-admin', 'support']), async (_req, res) => {
  const roles = await prisma.role.findMany({ include: { permissions: { include: { permission: true } } } });
  res.json({ data: roles });
});

export default router;
