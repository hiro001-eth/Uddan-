import { Router } from 'express';
import { postLogin, postVerify2fa, postLogout, postResetConfirm, postResetRequest } from './controller';
import { postRefresh, postRegisterStaff } from './service';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import { optionalAuth } from '../../middleware/auth';

const router = Router();

router.get('/csrf', (req, res) => {
  const token = req.cookies['csrfToken'];
  res.json({ data: { csrfToken: token, headerName: 'x-csrf-token' } });
});

router.post('/login', postLogin);
router.post('/verify-2fa', optionalAuth, postVerify2fa);
router.post('/logout', postLogout);
router.post('/refresh', postRefresh);
router.post('/register', authRequired(true), requireRoles(['super-admin']), postRegisterStaff);
router.post('/password-reset/request', postResetRequest);
router.post('/password-reset/confirm', postResetConfirm);

export default router;
