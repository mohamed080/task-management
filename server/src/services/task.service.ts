import { isValidObjectId } from "mongoose";

import { BadRequestError, NotFoundError } from "../errors/app-error.js";
import { Task } from "../models/task.model.js";
import { getPagination } from "../utils/pagination.js";
import type { CreateTaskInput, TaskQueryInput, UpdateTaskInput } from "../validators/task.validator.js";

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const validateTaskId = (taskId: string): void => {
  if (!isValidObjectId(taskId)) {
    throw new BadRequestError("Invalid task ID");
  }
};

export const createTask = async (
  userId: string,
  data: CreateTaskInput,
) => {
  const task = await Task.create({
    ...data,
    userId
  });
  return task
}

export const getTasks = async (
  userId: string,
  query: TaskQueryInput,
) => {
  const { page, limit, skip } = getPagination(query);

  const filter = {
    userId,
    ...(query.status && {
      status: query.status,
    }),
    ...(query.priority && {
      priority: query.priority,
    }),
    ...(query.search && {
      title: {
        $regex: escapeRegex(query.search),
        $options: "i",
      },
    }),
  };

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTaskById = async (
  userId: string,
  taskId: string,
) => {
  validateTaskId(taskId);

  const task = await Task.findOne({
    _id: taskId,
    userId,
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  return task;
};

export const updateTask = async (
  userId: string,
  taskId: string,
  data: UpdateTaskInput,
) => {
  validateTaskId(taskId);

  const task = await Task.findOneAndUpdate({
    _id: taskId,
    userId,
  },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  return task
}

export const deleteTask = async (
  userId: string,
  taskId: string,
) => {
  validateTaskId(taskId);

  const task = await Task.findOneAndDelete({
    _id: taskId,
    userId,
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  return task
}