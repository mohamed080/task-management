import type { Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/app-error.js";
import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/user.model.js";
import type { AuthenticatedRequest } from "../types/express.js";

export const requireAuth = async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Authentication token is required");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new UnauthorizedError("Authentication token is required");
    }

    try {
        const payload = verifyToken(token);

        const userExists = await User.exists({ _id: payload.userId });
        if (!userExists) {
            throw new UnauthorizedError("User associated with this token no longer exists");
        }

        req.userId = payload.userId;
        next();
    } catch (error: unknown) {
        if (error instanceof Error && error.name === "TokenExpiredError") {
            throw new UnauthorizedError("Session has expired, please log in again");
        }
        if (error instanceof Error && error.name === "JsonWebTokenError") {
            throw new UnauthorizedError("Invalid token, please log in again");
        }
        throw error;
    }
};
