import type { Request, RequestHandler, Response } from "express";

import { BadRequestError, UnauthorizedError } from "../errors/app-error.js";
import { getCurrentUser, loginUser, registerUser } from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import type { AuthenticatedRequest } from "../types/express.js";

export const register = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        const messages = result.error.issues.map(
            (issue) => {
                const field = issue.path.join(".");

                return `${field}: ${issue.message}`;
            },
        );

        throw new BadRequestError(messages);
    }

    const data = await registerUser(result.data);

    res.status(201).json({
        success: true,
        data,
    });
};

export const login = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        const messages = result.error.issues.map(
            (issue) => {
                const field = issue.path.join(".");

                return `${field}: ${issue.message}`;
            },
        );

        throw new BadRequestError(messages);
    }

    const data = await loginUser(result.data);

    res.status(200).json({
        success: true,
        data,
    });
};

export const getMe: RequestHandler = async(
    req,
    res: Response,
): Promise<void> => {
    const { userId } = req as Partial<AuthenticatedRequest>;

    if (!userId) {
        throw new UnauthorizedError("Authentication token is required");
    }

    const user = await getCurrentUser(userId);

    res.status(200).json({
        success: true,
        data: user,
    });
}
