import type { ErrorRequestHandler } from "express";

import {
  AppError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  InternalServerError,
} from "../errors/app-error.js";

const isErrorLike = (error: unknown): error is Error & Record<string, unknown> =>
  typeof error === "object" && error !== null && "name" in error;

const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (isErrorLike(error) && error.name === "ValidationError" && "errors" in error) {
    const errors = error.errors as Record<string, { message?: string }>;
    const messages = Object.values(errors).map(
      (err) => err.message || "Validation failed",
    );
    return new BadRequestError(messages);
  }

  if (isErrorLike(error) && error.name === "CastError") {
    const path = (error as Record<string, unknown>).path;
    return new BadRequestError(`Invalid format for path: ${path}`);
  }

  if (typeof error === "object" && error !== null && "code" in error && (error as Record<string, unknown>).code === 11000) {
    const keyValue = (error as Record<string, unknown>).keyValue as Record<string, unknown> | undefined;
    const keys = Object.keys(keyValue || {}).join(", ");
    return new ConflictError(`Record with duplicate field(s) (${keys}) already exists`);
  }

  if (isErrorLike(error) && (error.name === "ZodError" || error.constructor?.name === "ZodError")) {
    const issues = (error as unknown as { issues?: Array<{ path: string[]; message: string }> }).issues || [];
    const messages = issues.map((issue) => {
      const field = issue.path.join(".");
      return `${field}: ${issue.message}`;
    });
    return new BadRequestError(messages);
  }

  if (isErrorLike(error) && error.name === "JsonWebTokenError") {
    return new UnauthorizedError("Invalid token, please login again");
  }
  if (isErrorLike(error) && error.name === "TokenExpiredError") {
    return new UnauthorizedError("Session expired, please login again");
  }

  const message = process.env.NODE_ENV === "development" && error instanceof Error && error.message 
    ? error.message 
    : "Internal server error";
  return new InternalServerError(message);
};

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (!(error instanceof AppError)) {
    console.error("Unhandled server error:", error);
  }

  const normalized = normalizeError(error);

  res.status(normalized.statusCode).json({
    statusCode: normalized.statusCode,
    error: getErrorName(normalized.statusCode),
    message:
      normalized.messages.length === 1
        ? normalized.messages[0]
        : normalized.messages,
    code: normalized.code,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
};

const getErrorName = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    default:
      return "INTERNAL_SERVER_ERROR";
  }
};