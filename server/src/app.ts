import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { connectDatabase } from "./config/database.js";
import authRouter from "./routes/auth.routes.js"; // Adjust path as needed

const app: Application = express();

app.set("trust proxy", 1);

// Enable CORS for preflight OPTIONS requests
app.use(cors());

app.use(express.json());

// Database connection middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Internal Server Error: DB Connection Failed" });
  }
});

// Health check endpoint (matches both /health and /api/health)
app.get(["/health", "/api/health"], (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Task Management API is running",
  });
});

// Mount authentication routes for both local and serverless paths
app.use(["/auth", "/api/auth"], authRouter);

export default app;