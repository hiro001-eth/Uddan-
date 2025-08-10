import { z } from 'zod';

export const JobCreateSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  country: z.string().min(1),
  city: z.string().optional(),
  jobType: z.string().min(1),
  salaryMin: z.number().int().optional(),
  salaryMax: z.number().int().optional(),
  description: z.string().min(1),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  contactEmail: z.string().email(),
  status: z.string().default('draft'),
  featured: z.boolean().optional(),
});

export const JobUpdateSchema = JobCreateSchema.partial();

export const JobQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  q: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  country: z.string().optional(),
  status: z.string().optional(),
});
