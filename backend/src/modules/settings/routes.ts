import { Router } from 'express';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import prisma from '../../prisma';

const router = Router();
router.use(authRequired(true));

router.get('/', requireRoles(['super-admin', 'support']), async (_req, res) => {
  const items = await prisma.setting.findMany();
  res.json({ data: items });
});

router.put('/:key', requireRoles(['super-admin']), async (req, res) => {
  const key = req.params.key;
  const valueJson = JSON.stringify(req.body);
  const userId = (req as any).user.sub as string;
  const item = await prisma.setting.upsert({
    where: { key },
    update: { valueJson, updatedBy: userId, updatedAt: new Date() },
    create: { key, valueJson, updatedBy: userId },
  });
  res.json({ data: item });
});

export default router;
