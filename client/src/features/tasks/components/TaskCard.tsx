import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock3, Pencil, Trash2 } from "lucide-react";

import { formatDate } from "../../../utils/date";
import type { Task, TaskPriority, TaskStatus } from "../task.types";

const statusMeta: Record<
  TaskStatus,
  { label: string; icon: typeof Circle; color: string }
> = {
  todo: { label: "To do", icon: Circle, color: "text-slate-500" },
  in_progress: { label: "In progress", icon: Clock3, color: "text-amber-600" },
  done: { label: "Done", icon: CheckCircle2, color: "text-emerald-600" },
};
const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-700",
};

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  const meta = statusMeta[task.status];
  const StatusIcon = meta.icon;
  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col gap-5 rounded-2xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
      initial={{ opacity: 0, y: 8 }}
      layout
      exit={{ opacity: 0, scale: 0.98, y: -8 }}
      transition={{ delay: index * 0.04 }}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-sm font-bold ${meta.color}`}
          >
            <StatusIcon size={17} />
            {meta.label}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${priorityStyles[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>
        <h3 className="mt-3 truncate text-lg font-black tracking-[-0.02em]">
          {task.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
          {task.description}
        </p>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-400">
          <Clock3 size={14} /> Due {formatDate(task.dueDate)}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          aria-label={`Edit ${task.title}`}
          className="grid size-10 place-items-center rounded-xl text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
          onClick={() => onEdit(task)}
          title="Edit task"
          type="button"
        >
          <Pencil size={17} />
        </button>
        <button
          aria-label={`Delete ${task.title}`}
          className="grid size-10 place-items-center rounded-xl text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
          onClick={() => onDelete(task)}
          title="Delete task"
          type="button"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </motion.article>
  );
}
