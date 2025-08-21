
import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { encryptSensitiveData } from '../../middleware/encryption.js';
import { adminController } from './controller.js';

const router = Router();

// Super Admin Routes
router.get('/dashboard/stats', 
  authenticateToken, 
  requireRole(['super-admin']), 
  adminController.getDashboardStats
);

router.get('/users', 
  authenticateToken, 
  requireRole(['super-admin', 'admin']), 
  adminController.getAllUsers
);

router.post('/users', 
  authenticateToken, 
  requireRole(['super-admin']), 
  encryptSensitiveData,
  adminController.createUser
);

router.put('/users/:id', 
  authenticateToken, 
  requireRole(['super-admin']), 
  encryptSensitiveData,
  adminController.updateUser
);

router.delete('/users/:id', 
  authenticateToken, 
  requireRole(['super-admin']), 
  adminController.deleteUser
);

// Content Management
router.get('/jobs', 
  authenticateToken, 
  requireRole(['super-admin', 'admin', 'hr']), 
  adminController.getAllJobs
);

router.post('/jobs', 
  authenticateToken, 
  requireRole(['super-admin', 'admin', 'hr']), 
  adminController.createJob
);

router.put('/jobs/:id', 
  authenticateToken, 
  requireRole(['super-admin', 'admin', 'hr']), 
  adminController.updateJob
);

router.delete('/jobs/:id', 
  authenticateToken, 
  requireRole(['super-admin', 'admin']), 
  adminController.deleteJob
);

// Applications Management
router.get('/applications', 
  authenticateToken, 
  requireRole(['super-admin', 'admin', 'hr']), 
  adminController.getAllApplications
);

router.put('/applications/:id/status', 
  authenticateToken, 
  requireRole(['super-admin', 'admin', 'hr']), 
  adminController.updateApplicationStatus
);

// Events Management
router.get('/events', 
  authenticateToken, 
  requireRole(['super-admin', 'admin', 'event-manager']), 
  adminController.getAllEvents
);

router.post('/events', 
  authenticateToken, 
  requireRole(['super-admin', 'admin', 'event-manager']), 
  adminController.createEvent
);

// Consultations Management
router.get('/consultations', 
  authenticateToken, 
  requireRole(['super-admin', 'admin', 'support']), 
  adminController.getAllConsultations
);

// Media Management
router.get('/media', 
  authenticateToken, 
  requireRole(['super-admin', 'admin']), 
  adminController.getAllMedia
);

router.post('/media/upload', 
  authenticateToken, 
  requireRole(['super-admin', 'admin']), 
  adminController.uploadMedia
);

// Settings Management
router.get('/settings', 
  authenticateToken, 
  requireRole(['super-admin', 'admin']), 
  adminController.getSettings
);

router.put('/settings', 
  authenticateToken, 
  requireRole(['super-admin']), 
  adminController.updateSettings
);

// Audit Logs
router.get('/audit-logs', 
  authenticateToken, 
  requireRole(['super-admin']), 
  adminController.getAuditLogs
);

// Theme Management
router.get('/themes', 
  authenticateToken, 
  requireRole(['super-admin', 'admin']), 
  adminController.getThemes
);

router.put('/themes/active', 
  authenticateToken, 
  requireRole(['super-admin', 'admin']), 
  adminController.setActiveTheme
);

// Backup and Export
router.post('/backup', 
  authenticateToken, 
  requireRole(['super-admin']), 
  adminController.createBackup
);

router.get('/export/:type', 
  authenticateToken, 
  requireRole(['super-admin', 'admin']), 
  adminController.exportData
);

export default router;
