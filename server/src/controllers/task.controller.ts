import type { Request, RequestHandler } from "express";

import { BadRequestError, UnauthorizedError } from "../errors/app-error.js";
import {
  createTask as createTaskService,
  deleteTask as deleteTaskService,
  getTaskById as getTaskByIdService,
  getTasks as getTasksService,
  updateTask as updateTaskService,
} from "../services/task.service.js";
import {
  createTaskSchema,
  taskIdSchema,
  taskQuerySchema,
  updateTaskSchema,
} from "../validators/task.validator.js";
import type { AuthenticatedRequest } from "../types/express.js";

const parseOrThrow = <T>(result: { success: true; data: T } | { success: false; error: { issues: Array<{ path: PropertyKey[]; message: string }> } }): T => {
  if (result.success) {
    return result.data;
  }

  throw new BadRequestError(
    result.error.issues.map((issue) => {
      const field = issue.path.join(".");
      return `${field}: ${issue.message}`;
    }),
  );
};

const getUserId = (req: Request): string => {
  const { userId } = req as Partial<AuthenticatedRequest>;

  if (!userId) {
    throw new UnauthorizedError("Authentication token is required");
  }

  return userId;
};

export const createTask: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  const data = parseOrThrow(createTaskSchema.safeParse(req.body));
  const task = await createTaskService(getUserId(req), data);

  res.status(201).json({
    success: true,
    data: task,
  });
};

export const getTasks: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  const query = parseOrThrow(taskQuerySchema.safeParse(req.query));
  const data = await getTasksService(getUserId(req), query);

  res.status(200).json({
    success: true,
    data,
  });
};

export const getTaskById: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  const { id } = parseOrThrow(taskIdSchema.safeParse(req.params));
  const task = await getTaskByIdService(getUserId(req), id);

  res.status(200).json({
    success: true,
    data: task,
  });
};

export const updateTask: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  const { id } = parseOrThrow(taskIdSchema.safeParse(req.params));
  const data = parseOrThrow(updateTaskSchema.safeParse(req.body));
  const task = await updateTaskService(getUserId(req), id, data);

  res.status(200).json({
    success: true,
    data: task,
  });
};

export const deleteTask: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  const { id } = parseOrThrow(taskIdSchema.safeParse(req.params));
  await deleteTaskService(getUserId(req), id);

  res.status(204).send();
};
