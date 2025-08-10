import { z } from 'zod';

export const ContactCreateSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5).max(20),
  status: z.string().default('new'),
  message: z.string().optional(),
});

export const ContactUpdateSchema = ContactCreateSchema.partial();

export const ContactQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  q: z.string().optional(),
  status: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});


