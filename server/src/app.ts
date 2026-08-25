import cors, { type CorsOptions } from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import { NotFoundError } from "./errors/app-error.js";
import { globalLimiter, authLimiter } from "./middleware/rate-limiter.js";
import { connectDatabase } from "./config/database.js";

const app: Express = express();

app.set("trust proxy", 1);

const corsOptions: CorsOptions = {
    origin: process.env.CLIENT_URL,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", globalLimiter);

app.use(async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    next(error);
  }
});

app.get("/api/health", (_req, res) => {
    res.status(200).json({ 
        success: true,
        message: "Task Management API is running",
    });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/tasks", taskRoutes);

app.use((req, _res, next) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;
