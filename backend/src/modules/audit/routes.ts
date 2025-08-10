import { Router } from 'express';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import prisma from '../../prisma';

const router = Router();
router.use(authRequired(true));

router.get('/', requireRoles(['super-admin', 'support']), async (_req, res) => {
  const items = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  res.json({ data: items });
});

export default router;
