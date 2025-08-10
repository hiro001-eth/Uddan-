import { Router } from 'express';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import { deleteContactCtrl, getContactById, getContacts, patchContact, postContact } from './controller';

const router = Router();

// Admin-secured routes
router.use(authRequired(true));
router.get('/', requireRoles(['super-admin', 'hr-manager', 'support']), getContacts);
router.get('/:id', requireRoles(['super-admin', 'hr-manager', 'support']), getContactById);
router.post('/', requireRoles(['super-admin', 'hr-manager', 'support']), postContact);
router.patch('/:id', requireRoles(['super-admin', 'hr-manager']), patchContact);
router.delete('/:id', requireRoles(['super-admin', 'hr-manager']), deleteContactCtrl);

export default router;


