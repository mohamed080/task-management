import cors from "cors";
import express, { type Express } from "express";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.status(200).json({ 
        success: true,
        message: "Task Management API is running",
    });
});

export default app;