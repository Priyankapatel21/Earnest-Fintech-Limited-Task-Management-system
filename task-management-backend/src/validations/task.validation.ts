import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  dueDate: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();