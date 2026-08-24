import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must not exceed 200 characters."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(2000, "Description must not exceed 2000 characters."),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z
    .string()
    .min(1, "Due date is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid due date."),
});