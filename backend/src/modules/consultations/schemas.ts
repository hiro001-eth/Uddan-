import { z } from 'zod';

export const ConsultationCreateSchema = z.object({
  bookingId: z.string().optional(),
  userId: z.string().uuid().optional(),
  date: z.string().datetime(),
  status: z.string().min(1),
  adminNotes: z.string().optional(),
  reminders: z.string().optional(),
});

export const ConsultationUpdateSchema = ConsultationCreateSchema.partial();

export const ConsultationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  q: z.string().optional(),
});
