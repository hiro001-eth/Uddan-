import { z } from 'zod';

export const ConsultationCreateSchema = z.object({
  bookingId: z.string().optional(),
  userId: z.string().uuid().optional(),
  // public fields
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5).max(20),
  preferredDate: z.string().datetime(),
  preferredTime: z.string().min(1),
  // admin fields
  date: z.string().datetime().optional(),
  status: z.string().min(1).default('pending'),
  adminNotes: z.string().optional(),
  reminders: z.string().optional(),
});

export const ConsultationUpdateSchema = ConsultationCreateSchema.partial();

export const ConsultationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  q: z.string().optional(),
});
