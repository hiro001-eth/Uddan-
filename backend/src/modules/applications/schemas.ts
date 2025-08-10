import { z } from 'zod';

export const ApplicationCreateSchema = z.object({
  jobId: z.string().uuid(),
  candidateName: z.string().min(1),
  candidatePhone: z.string().min(5).max(20),
  candidateEmail: z.string().email(),
  resumePath: z.string().optional(),
  coverLetter: z.string().optional(),
  status: z.string().default('pending'),
  notes: z.string().optional(),
});

export const ApplicationUpdateSchema = ApplicationCreateSchema.partial();

export const ApplicationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  q: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});
