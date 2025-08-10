import { PrismaClient } from '@prisma/client';
import { env } from '../src/config/env';
import { hashPassword } from '../src/utils/password';
import { authenticator } from 'otplib';
const prisma = new PrismaClient();
async function main() {
    const roles = [
        'super-admin',
        'content-admin',
        'hr-manager',
        'event-manager',
        'support',
    ];
    // Basic permissions list (can be expanded)
    const permissions = [
        'users.read', 'users.write',
        'roles.read', 'roles.write',
        'pages.read', 'pages.write',
        'jobs.read', 'jobs.write',
        'applications.read', 'applications.write',
        'events.read', 'events.write',
        'consultations.read', 'consultations.write',
        'media.read', 'media.write',
        'settings.read', 'settings.write',
        'audit.read',
    ];
    await prisma.$transaction(async (tx) => {
        const roleRecords = await Promise.all(roles.map((name) => tx.role.upsert({ where: { name }, update: {}, create: { name } })));
        const permRecords = await Promise.all(permissions.map((name) => tx.permission.upsert({ where: { name }, update: {}, create: { name, description: name } })));
        // Grant all permissions to super-admin
        const superAdmin = roleRecords.find((r) => r.name === 'super-admin');
        for (const p of permRecords) {
            await tx.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: superAdmin.id, permissionId: p.id } },
                update: {},
                create: { roleId: superAdmin.id, permissionId: p.id },
            });
        }
        // Create super admin user
        const email = env.SEED_SUPERADMIN_EMAIL;
        const existing = await tx.user.findUnique({ where: { email } });
        if (!existing) {
            const passwordHash = await hashPassword(env.SEED_SUPERADMIN_PASSWORD);
            const mfaSecret = authenticator.generateSecret();
            const user = await tx.user.create({
                data: {
                    name: env.SEED_SUPERADMIN_NAME,
                    email,
                    passwordHash,
                    roleId: superAdmin.id,
                    isActive: true,
                    mfaSecret,
                },
            });
            const otpauth = authenticator.keyuri(user.email, 'Uddaan Agencies Admin', mfaSecret);
            // eslint-disable-next-line no-console
            console.log('Seeded Super Admin:');
            console.log({ email, password: env.SEED_SUPERADMIN_PASSWORD, mfaSecret, otpauth });
        }
    });
    // Sample data
    const admin = await prisma.user.findFirstOrThrow({ where: { email: env.SEED_SUPERADMIN_EMAIL } });
    await prisma.page.upsert({
        where: { slug: 'home' },
        update: {},
        create: {
            slug: 'home', title: 'Welcome', body: '<h1>Welcome</h1>', status: 'published', authorId: admin.id, version: 1, publishedAt: new Date(),
        },
    });
    await prisma.job.create({
        data: {
            title: 'Welder - Qatar', company: 'GulfWorks', country: 'Qatar', jobType: 'Full-time', description: 'Welding job', contactEmail: 'hr@gulfworks.com', status: 'open', creator: { connect: { id: admin.id } },
        },
    });
}
main().then(() => prisma.$disconnect());
