import { z } from 'zod';

export const createMoodSchema = z.object({
  mood: z.string().min(1, 'mood is required'),
  emotion: z.string().min(1, 'emotion is required'),
  date: z.string().min(1, 'date is required'),
  color: z.string().optional(),
  notes: z.string().optional(),
});