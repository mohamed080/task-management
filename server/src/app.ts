import express, { Application, Request, Response, NextFunction } from "express";
import { connectDatabase } from "./config/database.js";

// Explicitly annotate 'app' as Application
const app: Application = express();

// Fix 1: Express Rate Limit Proxy Error
app.set("trust proxy", 1);

app.use(express.json());

// Fix 2: Ensure database connection on every request (Vercel Serverless Fix)
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Internal Server Error: DB Connection Failed" });
  }
});

// Import and attach your routes here
// app.use("/api/auth", authRoutes);

export default app;