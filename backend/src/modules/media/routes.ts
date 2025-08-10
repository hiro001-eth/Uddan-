import { Router } from 'express';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { authRequired } from '../../middleware/auth';
import { requireRoles } from '../../middleware/rbac';
import { env } from '../../config/env';
import prisma from '../../prisma';

const s3 = new S3Client({ region: env.AWS_REGION, credentials: env.AWS_ACCESS_KEY_ID === 'replace' ? undefined : { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY } });
const router = Router();

router.use(authRequired(true));

router.post('/presign-upload', requireRoles(['super-admin', 'hr-manager', 'content-admin']), async (req, res) => {
  const { filename, mimeType } = req.body as { filename: string; mimeType: string };
  const key = `uploads/${Date.now()}-${filename}`;
  const command = new PutObjectCommand({ Bucket: env.S3_BUCKET_NAME, Key: key, ContentType: mimeType });
  const url = await getSignedUrl(s3, command, { expiresIn: env.S3_SIGNED_URL_TTL_SECONDS });
  await prisma.media.create({ data: { filename, mimeType, size: 0, path: key, storageBackend: 's3', uploadedBy: (req as any).user.sub, tags: [] } });
  res.json({ data: { uploadUrl: url, path: key } });
});

router.get('/presign-download', requireRoles(['super-admin', 'hr-manager', 'content-admin', 'support']), async (req, res) => {
  const { path } = req.query as { path: string } as any;
  const command = new GetObjectCommand({ Bucket: env.S3_BUCKET_NAME, Key: String(path) });
  const url = await getSignedUrl(s3, command, { expiresIn: env.S3_SIGNED_URL_TTL_SECONDS });
  res.json({ data: { downloadUrl: url } });
});

export default router;
