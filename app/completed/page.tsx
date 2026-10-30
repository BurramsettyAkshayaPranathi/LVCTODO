"use client";

import Link from "next/link";
import { CheckCircle2, ArrowLeft, Trash2, RotateCcw, Lock, LogIn } from "lucide-react";
import { useTodos } from "@/hooks/useTodos";
import SuperDbBanner from "@/components/SuperDbBanner";

export default function CompletedPage() {
  const { todos, loading, error, isConfigured, user, deleteTodo, toggleTodo } =
    useTodos();

  const isLoggedIn = Boolean(user);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <SuperDbBanner isConfigured={isConfigured} error={error} />

        <div className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-white shadow-lg">
          <CheckCircle2 size={38} />

          <h1 className="mt-4 text-3xl font-bold">Completed Tasks</h1>

          <p className="mt-2 text-emerald-50">
            {isLoggedIn
              ? `You have completed ${completedTodos.length} tasks. Great work!`
              : "Sign in to track your personal completed tasks."}
          </p>
        </div>

        {!isLoggedIn ? (
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-white p-12 text-center">
            <Lock size={38} className="mx-auto text-indigo-400" />
            <h2 className="mt-4 text-lg font-semibold text-slate-800">
              Sign In to View Completed Tasks
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
              Your tasks are stored privately under your account. Sign in with
              your email to view and manage them.
            </p>
            <Link
              href="/auth"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
            >
              <LogIn size={16} />
              <span>Sign In / Create Account</span>
            </Link>
          </div>
        ) : loading ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading your completed tasks...
          </div>
        ) : (
          <div className="space-y-3">
            {completedTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <CheckCircle2
                  size={23}
                  className="shrink-0 text-emerald-500"
                />

                <div className="min-w-0 flex-1">
                  <p className="break-words font-semibold text-slate-700 line-through">
                    {todo.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Completed · {new Date(todo.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleTodo(todo.id)}
                    aria-label={`Mark ${todo.title} as active`}
                    title="Restore task"
                    className="rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <RotateCcw size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label={`Delete ${todo.title}`}
                    title="Delete permanently"
                    className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {completedTodos.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                <CheckCircle2
                  size={42}
                  className="mx-auto text-slate-300"
                />
                <h2 className="mt-4 font-semibold text-slate-700">
                  No completed tasks yet
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Complete a task from your active list to see it tracked here.
                </p>
                <Link
                  href="/"
                  className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                >
                  Go to Tasks
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
