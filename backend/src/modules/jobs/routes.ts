import { Router } from 'express';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import { deleteJobCtrl, exportJobs, getJobById, getJobs, importJobs, patchJob, postJob } from './controller';

const router = Router();

router.use(authRequired(true));
router.get('/', requireRoles(['super-admin', 'hr-manager', 'support']), getJobs);
router.get('/export/csv', requireRoles(['super-admin', 'hr-manager']), exportJobs);
router.post('/import/csv', requireRoles(['super-admin', 'hr-manager']), importJobs);
router.get('/:id', requireRoles(['super-admin', 'hr-manager', 'support']), getJobById);
router.post('/', requireRoles(['super-admin', 'hr-manager']), postJob);
router.patch('/:id', requireRoles(['super-admin', 'hr-manager']), patchJob);
router.delete('/:id', requireRoles(['super-admin', 'hr-manager']), deleteJobCtrl);

export default router;
