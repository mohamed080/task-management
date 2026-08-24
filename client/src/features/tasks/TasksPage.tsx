import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListTodo, Plus } from "lucide-react";

import { ApiError } from "../../api/http";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { useAuthStore } from "../auth/auth.store";
import {
  TaskCard,
  TaskFilters as TaskFiltersComponent,
  TaskForm,
  TaskPagination,
} from "./components";
import type { CreateTaskInput, Task, TaskFilters } from "./task.types";
import { useTasks } from "./useTasks";

const initialFilters: TaskFilters = {
  search: "",
  status: "all",
  priority: "all",
  page: 1,
  limit: 8,
};
const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError ? error.message : fallback;

export function TasksPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [filters, setFilters] = useState(initialFilters);
  const [searchInput, setSearchInput] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [actionError, setActionError] = useState("");
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    createTask,
    updateTask,
    deleteTask,
    isCreatingTask,
    isUpdatingTask,
    isDeletingTask,
  } = useTasks(filters);

  useEffect(() => {
    const timer = window.setTimeout(
      () =>
        setFilters((current) =>
          current.search === searchInput
            ? current
            : { ...current, search: searchInput, page: 1 },
        ),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [searchInput]);
  const tasks = data?.tasks ?? [];
  const pagination = data?.pagination;
  const hasFilters = Boolean(
    filters.search || filters.status !== "all" || filters.priority !== "all",
  );
  const updateFilter = (
    field: "status" | "priority",
    value: TaskFilters[typeof field],
  ) => setFilters((current) => ({ ...current, [field]: value, page: 1 }));
  const handleSave = async (input: CreateTaskInput) => {
    setActionError("");
    if (editingTask) await updateTask({ taskId: editingTask._id, input });
    else await createTask(input);
    setEditingTask(null);
    setIsCreating(false);
  };
  const handleDelete = async (task: Task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setActionError("");
    try {
      await deleteTask(task._id);
    } catch (deleteError) {
      setActionError(
        getErrorMessage(deleteError, "Unable to delete this task."),
      );
    }
  };
  const closeForm = () => {
    setEditingTask(null);
    setIsCreating(false);
  };

  return (
    <main className="min-h-screen bg-[#f4f7f2] px-4 py-6 text-slate-950 sm:px-8 lg:py-10">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 14 }}
        transition={{ duration: 0.3 }}
      >
        <header className="flex flex-col gap-5 rounded-3xl border border-white bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              Your workspace
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Good to see you, {user?.name}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              A clear view of everything that needs your attention.
            </p>
          </div>
          <Button
            className="bg-[#17231d] text-white hover:bg-emerald-950"
            onClick={logout}
          >
            Log out
          </Button>
        </header>
        <section className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <ListTodo className="text-emerald-700" size={26} />
              <h2 className="text-2xl font-black tracking-[-0.03em]">Tasks</h2>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Plan the work, then make progress visible.
            </p>
          </div>
          <Button
            className="gap-2 self-start sm:self-auto"
            onClick={() => {
              setActionError("");
              setIsCreating(true);
            }}
          >
            <Plus size={18} /> New task
          </Button>
        </section>
        <TaskFiltersComponent
          filters={filters}
          hasFilters={hasFilters}
          onClear={() => {
            setSearchInput("");
            setFilters(initialFilters);
          }}
          onFilterChange={updateFilter}
          onSearchChange={setSearchInput}
          searchInput={searchInput}
        />
        <div className="mt-6">
          <ErrorMessage message={actionError} />
          {error && (
            <div aria-live="polite" className="grid gap-3">
              <ErrorMessage
                message={getErrorMessage(error, "Unable to load your tasks.")}
              />
              <Button
                className="w-fit"
                onClick={() => void refetch()}
                variant="secondary"
              >
                Try again
              </Button>
            </div>
          )}
          {isLoading && (
            <div className="grid gap-3">
              {[1, 2, 3].map((item) => (
                <div
                  className="h-32 animate-pulse rounded-2xl bg-white/75"
                  key={item}
                />
              ))}
            </div>
          )}
          {!isLoading && !error && tasks.length === 0 && (
            <EmptyState
              description={
                hasFilters
                  ? "Try changing your search or filters."
                  : "Create your first task and give your next step a place to land."
              }
              title={hasFilters ? "No matching tasks" : "No tasks yet"}
            />
          )}
          {!isLoading && !error && tasks.length > 0 && (
            <div
              className={`grid gap-3 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
            >
              <AnimatePresence initial={false} mode="popLayout">
              {tasks.map((task, index) => (
                <TaskCard
                  index={index}
                  key={task._id}
                  onDelete={handleDelete}
                  onEdit={(selectedTask) => {
                    setActionError("");
                    setEditingTask(selectedTask);
                  }}
                  task={task}
                />
              ))}
              </AnimatePresence>
            </div>
          )}
        </div>
        {pagination && (
          <TaskPagination
            onPageChange={(page) =>
              setFilters((current) => ({ ...current, page }))
            }
            page={pagination.page}
            total={pagination.total}
            totalPages={pagination.totalPages}
          />
        )}
      </motion.section>
      {(isCreating || editingTask) && (
        <TaskForm
          isSaving={isCreatingTask || isUpdatingTask}
          onClose={closeForm}
          onSave={handleSave}
          task={editingTask}
        />
      )}
      {isDeletingTask && (
        <div className="fixed bottom-5 right-5 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-xl">
          Deleting task...
        </div>
      )}
    </main>
  );
}
