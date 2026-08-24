import { ChevronLeft, ChevronRight } from "lucide-react";

interface TaskPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function TaskPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: TaskPaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label="Task pagination"
      className="mt-7 flex items-center justify-between rounded-2xl border border-white bg-white/70 p-3"
    >
      <p className="px-2 text-sm font-semibold text-slate-500">
        Page {page} of {totalPages}{" "}
        <span className="hidden sm:inline">· {total} tasks</span>
      </p>
      <div className="flex gap-2">
        <button
          aria-label="Previous page"
          className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          aria-label="Next page"
          className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
}
