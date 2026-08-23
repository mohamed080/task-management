import { ErrorCode } from "./error-codes.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly messages: string[];
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    code: ErrorCode,
    messages: string | string[],
    details?: unknown,
  ) {
    super(
      Array.isArray(messages)
        ? messages.join(", ")
        : messages,
    );

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.messages = Array.isArray(messages)
      ? messages
      : [messages];
    this.details = details;

    Error.captureStackTrace(this, AppError);
  }
}

export class BadRequestError extends AppError {
  constructor(messages: string | string[], details?: unknown) {
    super(400, ErrorCode.VALIDATION_FAILED, messages, details);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(messages: string | string[] = "Unauthorized", details?: unknown) {
    super(401, ErrorCode.UNAUTHORIZED, messages, details);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(messages: string | string[] = "Forbidden", details?: unknown) {
    super(403, ErrorCode.FORBIDDEN, messages, details);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(messages: string | string[] = "Resource not found", details?: unknown) {
    super(404, ErrorCode.NOT_FOUND, messages, details);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(messages: string | string[], details?: unknown) {
    super(409, ErrorCode.CONFLICT, messages, details);
    this.name = "ConflictError";
  }
}

export class InternalServerError extends AppError {
  constructor(messages: string | string[] = "Internal server error", details?: unknown) {
    super(500, ErrorCode.INTERNAL_SERVER_ERROR, messages, details);
    this.name = "InternalServerError";
  }
}

export class TooManyRequestsError extends AppError {
  constructor(messages: string | string[] = "Too many requests, please try again later", details?: unknown) {
    super(429, ErrorCode.TOO_MANY_REQUESTS, messages, details);
    this.name = "TooManyRequestsError";
  }
}