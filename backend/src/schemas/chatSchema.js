import { z } from 'zod';

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system'], {
    errorMap: () => ({ message: "role must be 'user', 'assistant', or 'system'" }),
  }),
  content: z.string().min(1, 'message content cannot be empty'),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, 'at least one message is required'),
  emotion: z.string().min(1, 'emotion is required'),
});