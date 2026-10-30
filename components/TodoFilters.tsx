
"use client";

import type { TodoFilter } from "@/types/todo";

type Props = {
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
  total: number;
  active: number;
  completed: number;
};

export default function TodoFilters({
  filter,
  onChange,
  total,
  active,
  completed,
}: Props) {
  const filters: { label: string; value: TodoFilter; count: number }[] = [
    { label: "All tasks", value: "all", count: total },
    { label: "In progress", value: "active", count: active },
    { label: "Completed", value: "completed", count: completed },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            filter === item.value
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
        >
          {item.label}
          <span className="ml-2 opacity-70">{item.count}</span>
        </button>
      ))}
    </div>
  );
}
