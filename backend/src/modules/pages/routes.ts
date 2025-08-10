import { Router } from 'express';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import { deletePageCtrl, getPageById, getPages, patchPage, postPage } from './controller';

const router = Router();

router.use(authRequired(true));
router.get('/', requireRoles(['super-admin', 'content-admin', 'support']), getPages);
router.get('/:id', requireRoles(['super-admin', 'content-admin', 'support']), getPageById);
router.post('/', requireRoles(['super-admin', 'content-admin']), postPage);
router.patch('/:id', requireRoles(['super-admin', 'content-admin']), patchPage);
router.delete('/:id', requireRoles(['super-admin', 'content-admin']), deletePageCtrl);

export default router;
