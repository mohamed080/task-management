import { rateLimit } from "express-rate-limit";
import { TooManyRequestsError } from "../errors/app-error.js";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (_req, _res, next) => {
        next(new TooManyRequestsError("Too many requests from this IP, please try again after 15 minutes"));
    },
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs (login/register)
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(new TooManyRequestsError("Too many authentication attempts, please try again after 15 minutes"));
    },
});
