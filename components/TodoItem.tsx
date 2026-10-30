
"use client";

import { CalendarDays, Check, Trash2 } from "lucide-react";
import type { Todo } from "@/types/todo";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <article className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-indigo-100 hover:shadow-lg">
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Mark as active" : "Complete task"}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          todo.completed
            ? "border-indigo-600 bg-indigo-600 text-white"
            : "border-slate-300 text-transparent hover:border-indigo-500"
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`break-words text-sm font-semibold ${
            todo.completed
              ? "text-slate-400 line-through"
              : "text-slate-800"
          }`}
        >
          {todo.title}
        </p>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
          <CalendarDays size={13} />
          {new Date(todo.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
          <span>·</span>
          {todo.completed ? "Completed" : "In progress"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete ${todo.title}`}
        className="rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 size={17} />
      </button>
    </article>
  );
}
