import { Schema, model, type HydratedDocument, type Types } from "mongoose";

export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface ITask {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date;
    userId: Types.ObjectId;
}

export type TaskDocument = HydratedDocument<ITask>;

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minLength: 1,
            maxLength: 200,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxLength: 2000,
        },
        status: {
            type: String,
            required: true,
            enum: TASK_STATUSES,
            default: "todo",
        },
        priority: {
            type: String,
            required: true,
            enum: TASK_PRIORITIES,
            default: "medium",
        },
        dueDate: {
            type: Date,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Task = model<ITask>("Task", taskSchema);
