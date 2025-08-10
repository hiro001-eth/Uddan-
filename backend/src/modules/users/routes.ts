import { Router } from 'express';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import { deleteUserCtrl, getUserById, getUsers, patchUser, postUser } from './controller';

const router = Router();

router.use(authRequired(true));
router.get('/', requireRoles(['super-admin', 'support', 'hr-manager']), getUsers);
router.get('/:id', requireRoles(['super-admin', 'support']), getUserById);
router.post('/', requireRoles(['super-admin']), postUser);
router.patch('/:id', requireRoles(['super-admin']), patchUser);
router.delete('/:id', requireRoles(['super-admin']), deleteUserCtrl);

export default router;
