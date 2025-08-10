import { z } from 'zod';

export const PageCreateSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  status: z.enum(['draft', 'published', 'scheduled']).default('draft'),
  publishedAt: z.string().datetime().optional(),
});

export const PageUpdateSchema = PageCreateSchema.partial();

export const PageQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  q: z.string().optional(),
});
