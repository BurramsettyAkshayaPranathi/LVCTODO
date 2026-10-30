"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import SuperDbBanner from "@/components/SuperDbBanner";

export default function TodosPage() {
  const {
    todos,
    loading,
    error,
    isConfigured,
    user,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  const isLoggedIn = Boolean(user);
  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <SuperDbBanner isConfigured={isConfigured} error={error} />

        <div className="mb-8 rounded-3xl bg-indigo-600 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="mt-2 text-indigo-100">
            {isLoggedIn
              ? `${activeTodos.length} active tasks · ${completedTodos.length} completed`
              : "Sign in to access and manage your private to-do list"}
          </p>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-800">
            Quick Add Task
          </h2>
          <TodoForm onAdd={addTodo} isLoggedIn={isLoggedIn} error={error} />
        </div>

        <section className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Active Tasks</h2>
            {isLoggedIn && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {activeTodos.length} remaining
              </span>
            )}
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Loading tasks from database...
            </p>
          ) : (
            <TodoList
              todos={activeTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              isLoggedIn={isLoggedIn}
            />
          )}
        </section>
      </div>
    </main>
  );
}
