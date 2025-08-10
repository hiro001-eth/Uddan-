import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import { getJobs, getJobById } from '../modules/jobs/controller';
import { postApplication } from '../modules/applications/controller';
import authRoutes from '../modules/auth/routes';
import userRoutes from '../modules/users/routes';
import roleRoutes from '../modules/roles/routes';
import pageRoutes from '../modules/pages/routes';
import jobRoutes from '../modules/jobs/routes';
import applicationRoutes from '../modules/applications/routes';
import eventRoutes from '../modules/events/routes';
import consultationRoutes from '../modules/consultations/routes';
import mediaRoutes from '../modules/media/routes';
import settingRoutes from '../modules/settings/routes';
import auditRoutes from '../modules/audit/routes';
import contactRoutes from '../modules/contacts/routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/pages', pageRoutes);
router.use('/admin/jobs', jobRoutes);
router.use('/admin/applications', applicationRoutes);
router.use('/events', eventRoutes);
router.use('/consultations', consultationRoutes);
router.use('/media', mediaRoutes);
router.use('/settings', settingRoutes);
router.use('/audit', auditRoutes);
router.use('/admin/contacts', contactRoutes);

// Public endpoints for MVP
router.get('/jobs', optionalAuth, getJobs);
router.get('/jobs/:id', optionalAuth, getJobById);
router.post('/applications', postApplication);

export default router;
