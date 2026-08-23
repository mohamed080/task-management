import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from "../controllers/task.controller.js";

const router: Router = Router();

router.use(requireAuth);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
