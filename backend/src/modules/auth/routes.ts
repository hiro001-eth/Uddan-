import { Router } from 'express';
import { postLogin, postVerify2fa, postLogout, postResetConfirm, postResetRequest } from './controller';
import { optionalAuth } from '../../middleware/auth';

const router = Router();

router.get('/csrf', (req, res) => {
  const token = req.cookies['csrfToken'];
  res.json({ data: { csrfToken: token, headerName: 'x-csrf-token' } });
});

router.post('/login', postLogin);
router.post('/verify-2fa', optionalAuth, postVerify2fa);
router.post('/logout', postLogout);
router.post('/password-reset/request', postResetRequest);
router.post('/password-reset/confirm', postResetConfirm);

export default router;
