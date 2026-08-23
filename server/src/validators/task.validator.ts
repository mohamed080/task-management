import { z } from "zod";
import { TASK_STATUSES, TASK_PRIORITIES } from "../models/task.model.js";

export const taskStatusSchema = z.enum(TASK_STATUSES);
export const taskPrioritySchema = z.enum(TASK_PRIORITIES);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description must not exceed 2000 characters"),

  status: taskStatusSchema.default("todo"),

  priority: taskPrioritySchema.default("medium"),

  dueDate: z.coerce.date({ message: "A valid due date is required" }),
});

export const updateTaskSchema = createTaskSchema.partial().strict();

export const taskIdSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
});

const positiveIntegerQuerySchema = (field: string) =>
  z
    .string()
    .regex(/^\d+$/, `${field} must be a positive integer`)
    .transform(Number)
    .refine((value) => value > 0, `${field} must be greater than 0`);

export const taskQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  page: positiveIntegerQuerySchema("Page").optional(),
  limit: positiveIntegerQuerySchema("Limit")
    .refine((value) => value <= 100, "Limit must not exceed 100")
    .optional(),
}).strip();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdInput = z.infer<typeof taskIdSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
