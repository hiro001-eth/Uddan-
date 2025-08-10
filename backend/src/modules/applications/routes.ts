import { Router } from 'express';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import { deleteApplicationCtrl, getApplicationById, getApplications, patchApplication, postApplication } from './controller';

const router = Router();
router.use(authRequired(true));

router.get('/', requireRoles(['super-admin', 'hr-manager', 'support']), getApplications);
router.get('/:id', requireRoles(['super-admin', 'hr-manager', 'support']), getApplicationById);
router.post('/', requireRoles(['super-admin', 'hr-manager']), postApplication);
router.patch('/:id', requireRoles(['super-admin', 'hr-manager']), patchApplication);
router.delete('/:id', requireRoles(['super-admin', 'hr-manager']), deleteApplicationCtrl);

export default router;
