import { Search, X } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { priorityOptions, statusOptions } from "../task.constants";
import type { TaskFilters as TaskFiltersState } from "../task.types";

interface TaskFiltersProps {
  filters: TaskFiltersState;
  searchInput: string;
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (
    field: "status" | "priority",
    value: TaskFiltersState["status"] | TaskFiltersState["priority"],
  ) => void;
  onClear: () => void;
}

export function TaskFilters({
  filters,
  searchInput,
  hasFilters,
  onSearchChange,
  onFilterChange,
  onClear,
}: TaskFiltersProps) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto] lg:items-end">
        <label className="grid gap-2 text-sm font-bold text-slate-800">
          Search tasks
          <span className="relative">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />
            <input
              className="min-h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by title or description"
              value={searchInput}
            />
          </span>
        </label>
        <Select
          label="Status"
          onChange={(event) =>
            onFilterChange(
              "status",
              event.target.value as TaskFiltersState["status"],
            )
          }
          value={filters.status}
        >
          <option value="all">All statuses</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          label="Priority"
          onChange={(event) =>
            onFilterChange(
              "priority",
              event.target.value as TaskFiltersState["priority"],
            )
          }
          value={filters.priority}
        >
          <option value="all">All priorities</option>
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {hasFilters && (
          <Button className="gap-2" onClick={onClear} variant="secondary">
            <X size={16} /> Clear
          </Button>
        )}
      </div>
    </section>
  );
}
