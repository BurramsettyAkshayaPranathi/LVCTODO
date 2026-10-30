"use client";

import { ClipboardList, Lock, LogIn } from "lucide-react";
import Link from "next/link";
import type { Todo } from "@/types/todo";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLoggedIn?: boolean;
};

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  isLoggedIn = true,
}: Props) {
  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-dashed border-indigo-200 bg-white/70 px-5 py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Lock size={26} />
        </div>
        <h3 className="font-semibold text-slate-800">Private Workspace</h3>
        <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Sign in or create an account to manage your personal tasks. Tasks are
          isolated and private to each user.
        </p>
        <Link
          href="/auth"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition active:scale-95"
        >
          <LogIn size={15} />
          <span>Sign In / Create Account</span>
        </Link>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-5 py-14 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <ClipboardList size={27} />
        </div>
        <h3 className="font-semibold text-slate-800">No tasks yet</h3>
        <p className="mt-2 text-sm text-slate-500">
          Add your first personal task above to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
