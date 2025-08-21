
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env';
import { mountSwagger } from './config/swagger';
import routes from './routes';
import { csrfMiddleware } from './middleware/csrf';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { requestIdMiddleware } from './middleware/requestId';
import { logger } from './utils/logger';
import prisma from './prisma';
import { hashPassword } from './utils/password';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(requestIdMiddleware);

// CORS configuration
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'x-request-id']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
app.use(rateLimitMiddleware);

// CSRF protection
app.use(csrfMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api', routes);

// Swagger documentation
if (env.NODE_ENV !== 'production') {
  mountSwagger(app);
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: { 
      code: 'INTERNAL_SERVER_ERROR', 
      message: 'Something went wrong!' 
    } 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: { 
      code: 'NOT_FOUND', 
      message: 'Route not found' 
    } 
  });
});

async function main() {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Seed admin user if not exists
    await seedAdminUser();

    const server = app.listen(env.PORT, '0.0.0.0', () => {
      logger.info(`Server running on http://0.0.0.0:${env.PORT}`);
      if (env.NODE_ENV !== 'production') {
        logger.info(`API Documentation: http://localhost:${env.PORT}/api-docs`);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

async function seedAdminUser() {
  try {
    // Check if admin role exists
    let adminRole = await prisma.role.findFirst({
      where: { name: 'super-admin' }
    });

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          name: 'super-admin',
          permissions: {
            create: [
              { permission: { connectOrCreate: { where: { name: 'users:create' }, create: { name: 'users:create', description: 'create users' } } } },
              { permission: { connectOrCreate: { where: { name: 'users:read' }, create: { name: 'users:read', description: 'read users' } } } },
              { permission: { connectOrCreate: { where: { name: 'users:update' }, create: { name: 'users:update', description: 'update users' } } } },
              { permission: { connectOrCreate: { where: { name: 'users:delete' }, create: { name: 'users:delete', description: 'delete users' } } } },
              { permission: { connectOrCreate: { where: { name: 'jobs:create' }, create: { name: 'jobs:create', description: 'create jobs' } } } },
              { permission: { connectOrCreate: { where: { name: 'jobs:read' }, create: { name: 'jobs:read', description: 'read jobs' } } } },
              { permission: { connectOrCreate: { where: { name: 'jobs:update' }, create: { name: 'jobs:update', description: 'update jobs' } } } },
              { permission: { connectOrCreate: { where: { name: 'jobs:delete' }, create: { name: 'jobs:delete', description: 'delete jobs' } } } },
              { permission: { connectOrCreate: { where: { name: 'applications:create' }, create: { name: 'applications:create', description: 'create applications' } } } },
              { permission: { connectOrCreate: { where: { name: 'applications:read' }, create: { name: 'applications:read', description: 'read applications' } } } },
              { permission: { connectOrCreate: { where: { name: 'applications:update' }, create: { name: 'applications:update', description: 'update applications' } } } },
              { permission: { connectOrCreate: { where: { name: 'applications:delete' }, create: { name: 'applications:delete', description: 'delete applications' } } } },
              { permission: { connectOrCreate: { where: { name: 'admin:access' }, create: { name: 'admin:access', description: 'admin access' } } } },
              { permission: { connectOrCreate: { where: { name: 'admin:manage' }, create: { name: 'admin:manage', description: 'admin manage' } } } },
            ]
          }
        }
      });
      logger.info('Admin role created');
    }

    // Check if admin user exists
    const existingAdmin = await prisma.user.findFirst({
      where: { email: env.ADMIN_EMAIL || 'admin@uddaanagencies.com' }
    });

    if (!existingAdmin) {
      const passwordHash = await hashPassword(env.ADMIN_PASSWORD || 'ChangeMe_123!');
      
      await prisma.user.create({
        data: {
          name: env.ADMIN_NAME || 'Admin User',
          email: env.ADMIN_EMAIL || 'admin@uddaanagencies.com',
          passwordHash,
          phone: env.ADMIN_PHONE,
          roleId: adminRole.id,
          isActive: true
        }
      });
      
      logger.info('Admin user created successfully');
      logger.info(`Admin credentials - Email: ${env.ADMIN_EMAIL || 'admin@uddaanagencies.com'}, Password: ${env.ADMIN_PASSWORD || 'ChangeMe_123!'}`);
    } else {
      logger.info('Admin user already exists');
    }
  } catch (error) {
    logger.error({ err: error }, 'Error seeding admin user');
  }
}

main().catch((error) => {
  logger.error({ err: error }, 'Application startup error');
  process.exit(1);
});
