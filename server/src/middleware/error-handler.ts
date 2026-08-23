import type { ErrorRequestHandler } from "express";

import {
  AppError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  InternalServerError,
} from "../errors/app-error.js";

const normalizeError = (error: any): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  // Handle Mongoose Validation Error
  if (error.name === "ValidationError" && error.errors) {
    const messages = Object.values(error.errors).map(
      (err: any) => err.message || "Validation failed",
    );
    return new BadRequestError(messages);
  }

  // Handle Mongoose Cast Error (invalid ObjectIds etc.)
  if (error.name === "CastError") {
    return new BadRequestError(`Invalid format for path: ${error.path}`);
  }

  // Handle MongoDB duplicate key error
  if (error.code === 11000) {
    const keyValue = error.keyValue || {};
    const keys = Object.keys(keyValue).join(", ");
    return new ConflictError(`Record with duplicate field(s) (${keys}) already exists`);
  }

  // Handle Zod Schema Validation Error (if thrown directly)
  if (error.name === "ZodError" || error.constructor?.name === "ZodError") {
    const messages = (error.issues || []).map((issue: any) => {
      const field = issue.path.join(".");
      return `${field}: ${issue.message}`;
    });
    return new BadRequestError(messages);
  }

  // Handle JWT Validation Errors
  if (error.name === "JsonWebTokenError") {
    return new UnauthorizedError("Invalid token, please login again");
  }
  if (error.name === "TokenExpiredError") {
    return new UnauthorizedError("Session expired, please login again");
  }

  // Generic fallback: Internal Server Error
  const message = process.env.NODE_ENV === "development" && error.message 
    ? error.message 
    : "Internal server error";
  return new InternalServerError(message);
};

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  _next,
) => {
  // If it's not an AppError, it is an unexpected/unhandled system error, so we log it for debugging
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