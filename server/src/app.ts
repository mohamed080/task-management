import cors from "cors";
import express, { type Express } from "express";

import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import { NotFoundError } from "./errors/app-error.js";
import { globalLimiter, authLimiter } from "./middleware/rate-limiter.js";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/api", globalLimiter);

app.get("/api/health", (_req, res) => {
    res.status(200).json({ 
        success: true,
        message: "Task Management API is running",
    });
});

app.use("/api/auth", authLimiter, authRoutes);

app.use((req, _res, next) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;