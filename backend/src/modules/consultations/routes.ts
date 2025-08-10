import { Router } from 'express';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import { deleteConsultationCtrl, getConsultationById, getConsultations, patchConsultation, postConsultation } from './controller';

const router = Router();
router.use(authRequired(true));

router.get('/', requireRoles(['super-admin', 'support']), getConsultations);
router.get('/:id', requireRoles(['super-admin', 'support']), getConsultationById);
router.post('/', requireRoles(['super-admin', 'support']), postConsultation);
router.patch('/:id', requireRoles(['super-admin', 'support']), patchConsultation);
router.delete('/:id', requireRoles(['super-admin', 'support']), deleteConsultationCtrl);

export default router;
