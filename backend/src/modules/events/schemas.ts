import { z } from 'zod';

export const EventCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  venue: z.string().min(1),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  capacity: z.number().int().optional(),
  ticketPrice: z.number().int().optional(),
});

export const EventUpdateSchema = EventCreateSchema.partial();

export const EventQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  q: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});
