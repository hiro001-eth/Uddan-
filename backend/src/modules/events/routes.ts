import { Router } from 'express';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import { deleteEventCtrl, getEventById, getEvents, patchEvent, postEvent } from './controller';

const router = Router();
router.use(authRequired(true));

router.get('/', requireRoles(['super-admin', 'event-manager', 'support']), getEvents);
router.get('/:id', requireRoles(['super-admin', 'event-manager', 'support']), getEventById);
router.post('/', requireRoles(['super-admin', 'event-manager']), postEvent);
router.patch('/:id', requireRoles(['super-admin', 'event-manager']), patchEvent);
router.delete('/:id', requireRoles(['super-admin', 'event-manager']), deleteEventCtrl);

export default router;
