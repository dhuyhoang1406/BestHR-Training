import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must be under 120 characters'),
  description: z.string().optional(),
  userId: z.string().uuid('Select a user'),
  categoryIds: z
    .array(z.string().uuid())
    .max(5, 'Select up to 5 categories')
    .optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
