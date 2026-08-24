import "dotenv/config";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";


const { default: app } = await import("../src/app.js");
const { Task } = await import("../src/models/task.model.js");
const { User } = await import("../src/models/user.model.js");

let mongoServer: MongoMemoryServer;

const createUser = async (suffix: string) => {
    const response = await request(app)
        .post("/api/auth/register")
        .send({
            name: `Test ${suffix}`,
            email: `${suffix}@example.com`,
            password: "password123",
        });

    return response.body.data as { user: { id: string }; token: string };
};

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
    await Promise.all([User.deleteMany({}), Task.deleteMany({})]);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer?.stop();
});

describe("Task Management API", () => {
    it("registers, logs in, and returns the current user", async () => {
        const email = "auth@example.com";
        const registration = await request(app)
            .post("/api/auth/register")
            .send({ name: "Auth User", email, password: "password123" });

        expect(registration.status).toBe(201);
        expect(registration.body.data.token).toEqual(expect.any(String));

        const login = await request(app)
            .post("/api/auth/login")
            .send({ email, password: "password123" });

        expect(login.status).toBe(200);
        const token = login.body.data.token as string;

        const me = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);

        expect(me.status).toBe(200);
        expect(me.body.data).toMatchObject({ name: "Auth User", email });
    });

    it("supports task CRUD and filtering for an authenticated user", async () => {
        const { token } = await createUser("owner");
        const auth = { Authorization: `Bearer ${token}` };
        const taskInput = {
            title: "Finish assessment",
            description: "Complete the API tests",
            status: "todo",
            priority: "high",
            dueDate: "2026-08-30",
        };

        const created = await request(app)
            .post("/api/tasks")
            .set(auth)
            .send(taskInput);

        expect(created.status).toBe(201);
        const taskId = created.body.data._id as string;

        const listed = await request(app)
            .get("/api/tasks?search=assessment&status=todo&priority=high&page=1&limit=10")
            .set(auth);

        expect(listed.status).toBe(200);
        expect(listed.body.data.tasks).toHaveLength(1);
        expect(listed.body.data.pagination).toMatchObject({ page: 1, limit: 10, total: 1 });

        const updated = await request(app)
            .patch(`/api/tasks/${taskId}`)
            .set(auth)
            .send({ status: "done" });

        expect(updated.status).toBe(200);
        expect(updated.body.data.status).toBe("done");

        const deleted = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set(auth);

        expect(deleted.status).toBe(204);
    });

    it("rejects unauthenticated and invalid requests", async () => {
        const missingToken = await request(app).get("/api/tasks");
        expect(missingToken.status).toBe(401);

        const validationUser = await createUser("validation");
        const invalidTask = await request(app)
            .get("/api/tasks/not-a-task-id")
            .set("Authorization", `Bearer ${validationUser.token}`);
        expect(invalidTask.status).toBe(400);

        const invalidQuery = await request(app)
            .get("/api/tasks?page=0&limit=101")
            .set("Authorization", `Bearer ${validationUser.token}`);
        expect(invalidQuery.status).toBe(400);
    });

    it("does not expose another user's task", async () => {
        const owner = await createUser("first-owner");
        const otherUser = await createUser("second-owner");
        const created = await request(app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${owner.token}`)
            .send({
                title: "Private task",
                description: "Only the owner can access this",
                dueDate: "2026-08-30",
            });

        const response = await request(app)
            .get(`/api/tasks/${created.body.data._id}`)
            .set("Authorization", `Bearer ${otherUser.token}`);

        expect(response.status).toBe(404);
    });
}, 10 * 60 * 1000);