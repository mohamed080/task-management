import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { ApiError } from "../../../api/http";
import { Button } from "../../../components/ui/Button";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { priorityOptions, statusOptions } from "../task.constants";
import { createTaskSchema } from "../task.schemas";
import type {
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskStatus,
} from "../task.types";

interface TaskFormProps {
  task: Task | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (input: CreateTaskInput) => Promise<void>;
}

const getErrorMessage = (error: unknown) =>
  error instanceof ApiError ? error.message : "Unable to save this task.";

export function TaskForm({ task, isSaving, onClose, onSave }: TaskFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<CreateTaskInput>(
    task
      ? {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate.slice(0, 10),
        }
      : {
          title: "",
          description: "",
          status: "todo",
          priority: "medium",
          dueDate: "",
        },
  );
  const [error, setError] = useState("");
  useEffect(() => {
    titleInputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSaving, onClose]);
  const updateField = <Field extends keyof CreateTaskInput>(
    field: Field,
    value: CreateTaskInput[Field],
  ) => setForm((current) => ({ ...current, [field]: value }));
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const validation = createTaskSchema.safeParse(form);
    if (!validation.success) {
      setError(
        validation.error.issues[0]?.message ??
          "Check the task details and try again.",
      );
      return;
    }
    try { await onSave(validation.data); } catch (saveError) { setError(getErrorMessage(saveError)); }
  };

  return (
    <div
      aria-labelledby="task-form-title"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) onClose(); }}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="max-h-[calc(100svh-3rem)] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        initial={{ opacity: 0, y: 16 }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              {task ? "Edit task" : "New task"}
            </p>
            <h2
              className="mt-2 text-3xl font-black tracking-[-0.04em]"
              id="task-form-title"
            >
              {task ? "Refine the details." : "Capture the next step."}
            </h2>
          </div>
          <button
            aria-label="Close task form"
            className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            onClick={onClose}
            type="button"
          >
            <X size={19} />
          </button>
        </div>
        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <Input
            ref={titleInputRef}
            label="Task title"
            maxLength={200}
            onChange={(event) => updateField("title", event.target.value)}
            required
            value={form.title}
          />
          <Textarea
            label="Description"
            maxLength={2000}
            onChange={(event) => updateField("description", event.target.value)}
            required
            value={form.description}
          />
          <div className="grid gap-5 sm:grid-cols-3">
            <Select
              label="Status"
              onChange={(event) =>
                updateField("status", event.target.value as TaskStatus)
              }
              value={form.status}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              label="Priority"
              onChange={(event) =>
                updateField("priority", event.target.value as TaskPriority)
              }
              value={form.priority}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Input
              label="Due date"
              onChange={(event) => updateField("dueDate", event.target.value)}
              required
              type="date"
              value={form.dueDate}
            />
          </div>
          <ErrorMessage message={error} />
          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : task ? "Save changes" : "Create task"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
