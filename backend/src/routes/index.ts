import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import { ContactCreateSchema } from '../modules/contacts/schemas';
import { ConsultationCreateSchema } from '../modules/consultations/schemas';
import prisma from '../prisma';
import { emitEvent } from '../services/realtime';
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
import { authRequired } from '../middleware/auth';
import { requireRoles } from '../middleware/rbac';

const router = Router();

// Root route
router.get('/', (_req, res) => {
  res.json({
    message: 'Uddaan Consultancy API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

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

// Public submissions
router.post('/contacts', async (req, res) => {
  const body = ContactCreateSchema.parse(req.body);
  const created = await prisma.contact.create({ data: body });
  await prisma.auditLog.create({ data: { userId: null, action: 'create', model: 'Contact', modelId: created.id, changesJson: JSON.stringify(body) } });
  return res.status(201).json({ data: created });
});

router.post('/consultations', async (req, res) => {
  const body = ConsultationCreateSchema.parse(req.body);
  const created = await prisma.consultation.create({ data: body });
  await prisma.auditLog.create({ data: { userId: null, action: 'create', model: 'Consultation', modelId: created.id, changesJson: JSON.stringify(body) } });
  emitEvent('consultation:created', { id: created.id, name: created.name, preferredDate: created.preferredDate, preferredTime: created.preferredTime });
  return res.status(201).json({ data: created });
});

// Admin dashboard summary
router.get('/admin/dashboard', authRequired(true), requireRoles(['super-admin', 'hr-manager', 'support']), async (_req, res) => {
  const [jobsTotal, jobsActive, appsTotal, appsNew, usersTotal, consTotal, consPending] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { status: 'open' } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: 'pending' } }),
    prisma.user.count(),
    prisma.consultation.count(),
    prisma.consultation.count({ where: { status: 'pending' } }),
  ]);

  const data = {
    stats: {
      jobs: { total: jobsTotal, active: jobsActive },
      applications: { total: appsTotal, new: appsNew },
      users: { total: usersTotal },
      consultations: { total: consTotal, pending: consPending },
    },
  };
  return res.json({ data });
});

export default router;