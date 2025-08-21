
import { Router } from 'express';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import { encryptSensitiveData } from '../../middleware/encryption';
// Temporary controller placeholders to satisfy types if missing controller.ts
const adminController = {
  getDashboardStats: (_req: any, res: any) => res.json({ ok: true }),
  getAllUsers: (_req: any, res: any) => res.json({ ok: true }),
  createUser: (_req: any, res: any) => res.json({ ok: true }),
  updateUser: (_req: any, res: any) => res.json({ ok: true }),
  deleteUser: (_req: any, res: any) => res.json({ ok: true }),
  getAllJobs: (_req: any, res: any) => res.json({ ok: true }),
  createJob: (_req: any, res: any) => res.json({ ok: true }),
  updateJob: (_req: any, res: any) => res.json({ ok: true }),
  deleteJob: (_req: any, res: any) => res.json({ ok: true }),
  getAllApplications: (_req: any, res: any) => res.json({ ok: true }),
  updateApplicationStatus: (_req: any, res: any) => res.json({ ok: true }),
  getAllEvents: (_req: any, res: any) => res.json({ ok: true }),
  createEvent: (_req: any, res: any) => res.json({ ok: true }),
  getAllConsultations: (_req: any, res: any) => res.json({ ok: true }),
  getAllMedia: (_req: any, res: any) => res.json({ ok: true }),
  uploadMedia: (_req: any, res: any) => res.json({ ok: true }),
  getSettings: (_req: any, res: any) => res.json({ ok: true }),
  updateSettings: (_req: any, res: any) => res.json({ ok: true }),
  getAuditLogs: (_req: any, res: any) => res.json({ ok: true }),
  getThemes: (_req: any, res: any) => res.json({ ok: true }),
  setActiveTheme: (_req: any, res: any) => res.json({ ok: true }),
  createBackup: (_req: any, res: any) => res.json({ ok: true }),
  exportData: (_req: any, res: any) => res.json({ ok: true }),
};

const router = Router();

// Super Admin Routes
router.get('/dashboard/stats', 
  authRequired(true), 
  requireRoles(['super-admin']), 
  adminController.getDashboardStats
);

router.get('/users', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin']), 
  adminController.getAllUsers
);

router.post('/users', 
  authRequired(true), 
  requireRoles(['super-admin']), 
  encryptSensitiveData,
  adminController.createUser
);

router.put('/users/:id', 
  authRequired(true), 
  requireRoles(['super-admin']), 
  encryptSensitiveData,
  adminController.updateUser
);

router.delete('/users/:id', 
  authRequired(true), 
  requireRoles(['super-admin']), 
  adminController.deleteUser
);

// Content Management
router.get('/jobs', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin', 'hr']), 
  adminController.getAllJobs
);

router.post('/jobs', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin', 'hr']), 
  adminController.createJob
);

router.put('/jobs/:id', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin', 'hr']), 
  adminController.updateJob
);

router.delete('/jobs/:id', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin']), 
  adminController.deleteJob
);

// Applications Management
router.get('/applications', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin', 'hr']), 
  adminController.getAllApplications
);

router.put('/applications/:id/status', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin', 'hr']), 
  adminController.updateApplicationStatus
);

// Events Management
router.get('/events', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin', 'event-manager']), 
  adminController.getAllEvents
);

router.post('/events', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin', 'event-manager']), 
  adminController.createEvent
);

// Consultations Management
router.get('/consultations', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin', 'support']), 
  adminController.getAllConsultations
);

// Media Management
router.get('/media', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin']), 
  adminController.getAllMedia
);

router.post('/media/upload', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin']), 
  adminController.uploadMedia
);

// Settings Management
router.get('/settings', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin']), 
  adminController.getSettings
);

router.put('/settings', 
  authRequired(true), 
  requireRoles(['super-admin']), 
  adminController.updateSettings
);

// Audit Logs
router.get('/audit-logs', 
  authRequired(true), 
  requireRoles(['super-admin']), 
  adminController.getAuditLogs
);

// Theme Management
router.get('/themes', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin']), 
  adminController.getThemes
);

router.put('/themes/active', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin']), 
  adminController.setActiveTheme
);

// Backup and Export
router.post('/backup', 
  authRequired(true), 
  requireRoles(['super-admin']), 
  adminController.createBackup
);

router.get('/export/:type', 
  authRequired(true), 
  requireRoles(['super-admin', 'admin']), 
  adminController.exportData
);

export default router;
