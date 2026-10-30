"use client";

import { useState, type FormEvent } from "react";
import { Plus, LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";

type Props = {
  onAdd: (title: string) => void;
  isLoggedIn?: boolean;
  error?: string | null;
};

export default function TodoForm({
  onAdd,
  isLoggedIn = true,
  error,
}: Props) {
  const [title, setTitle] = useState("");
  const [localNotice, setLocalNotice] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalNotice(null);

    if (!isLoggedIn) {
      setLocalNotice("You must be logged in to save tasks to your account.");
      return;
    }

    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
  }

  const activeError = localNotice || error;

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (localNotice) setLocalNotice(null);
          }}
          placeholder={
            isLoggedIn
              ? "What needs to get done today?"
              : "Sign in with your email to add tasks..."
          }
          aria-label="New task"
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        />

        {isLoggedIn ? (
          <button
            type="submit"
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 active:scale-95"
          >
            <Plus size={19} />
            <span className="hidden sm:inline">Add task</span>
          </button>
        ) : (
          <Link
            href="/auth"
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 active:scale-95"
          >
            <LogIn size={17} />
            <span className="hidden sm:inline">Log In to Add</span>
          </Link>
        )}
      </form>

      {activeError && (
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
          <div className="flex-1">
            <p>{activeError}</p>
            {!isLoggedIn && (
              <Link
                href="/auth"
                className="mt-1 inline-block font-semibold text-indigo-700 underline"
              >
                Go to Sign In / Register →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
