
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
  ListTodo,
} from "lucide-react";

import TodoHeader from "@/components/TodoHeader";
import TodoForm from "@/components/TodoForm";
import TodoFilters from "@/components/TodoFilters";
import TodoStats from "@/components/TodoStats";
import TodoList from "@/components/TodoList";
import SuperDbBanner from "@/components/SuperDbBanner";

import { useTodos } from "@/hooks/useTodos";
import type { TodoFilter } from "@/types/todo";

export default function Home() {
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

  const [filter, setFilter] = useState<TodoFilter>("all");

  const isLoggedIn = Boolean(user);
  const active = todos.filter((todo) => !todo.completed).length;
  const completed = todos.length - active;

  const filteredTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }, [todos, filter]);

  // LOGGED-IN USER DASHBOARD
  if (isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#f7f8fc] px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <TodoHeader />

          <section className="mb-8 mt-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              <Sparkles size={14} />
              YOUR PRODUCTIVITY DASHBOARD
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Welcome back,{" "}
              <span className="text-indigo-600">
                {user?.email?.split("@")[0]}
              </span>
              !
            </h1>

            <p className="mt-3 text-sm text-slate-500 sm:text-base">
              Make today count. One task at a time.
            </p>
          </section>

          <SuperDbBanner
            isConfigured={isConfigured}
            error={error}
          />

          <div className="mb-7">
            <TodoStats
              total={todos.length}
              active={active}
              completed={completed}
            />
          </div>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  My Tasks
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your personal space to get things done.
                </p>
              </div>

              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                {active} remaining
              </span>
            </div>

            <TodoForm
              onAdd={addTodo}
              isLoggedIn={true}
              error={error}
            />

            <div className="my-6">
              <TodoFilters
                filter={filter}
                onChange={setFilter}
                total={todos.length}
                active={active}
                completed={completed}
              />
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-slate-500">
                Loading your tasks...
              </div>
            ) : (
              <TodoList
                todos={filteredTodos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                isLoggedIn={true}
              />
            )}
          </section>

          <footer className="py-8 text-center text-xs text-slate-400">
            Made for your goals. Powered by Taskly.
          </footer>
        </div>
      </main>
    );
  }

  // GUEST HOMEPAGE
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#f8f9ff]">

        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm">
              <Sparkles size={15} />
              A BETTER WAY TO GET THINGS DONE
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-7xl">
              Your day.
              <br />
              Your goals.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your progress.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              Take control of your day with Taskly. Organize your tasks,
              build better habits, and turn your plans into accomplishments.
              Everything you need to stay focused, all in one place.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">

              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-1 hover:bg-indigo-700"
              >
                Get started free
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
              >
                Explore Taskly
              </Link>

            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">

              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                Easy to use
              </span>

              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-500" />
                Private workspace
              </span>

              <span className="flex items-center gap-1.5">
                <Zap size={15} className="text-emerald-500" />
                Stay productive
              </span>

            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">

        <div className="mx-auto mb-12 max-w-xl text-center">

          <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            Everything you need
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Make productivity feel simple.
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            Everything you need to organize your work and stay focused,
            all in one personal workspace.
          </p>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {[
            {
              icon: ListTodo,
              title: "Organize your tasks",
              description:
                "Create and manage your daily tasks in one clean workspace.",
              color: "bg-indigo-50 text-indigo-600",
            },
            {
              icon: Target,
              title: "Track your progress",
              description:
                "See your active and completed tasks and understand your progress.",
              color: "bg-purple-50 text-purple-600",
            },
            {
              icon: ShieldCheck,
              title: "Private workspace",
              description:
                "Access your personal tasks through your authenticated account.",
              color: "bg-emerald-50 text-emerald-600",
            },
          ].map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-50"
              >
                <div
                  className={`mb-5 inline-flex rounded-xl p-3 ${feature.color}`}
                >
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-5 pb-20 sm:px-8">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-14 text-center text-white shadow-xl shadow-indigo-100 sm:px-12">

          <Sparkles className="mx-auto mb-5" size={30} />

          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to make today count?
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-indigo-100">
            Start organizing your tasks and take the first step towards
            a more productive day.
          </p>

          <Link
            href="/auth"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
          >
            Create your free account
            <ArrowRight size={17} />
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white px-5 py-8 sm:px-8">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">

          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-slate-900"
          >
            <div className="rounded-lg bg-indigo-600 p-2 text-white">
              <CheckCircle2 size={17} />
            </div>
            Taskly
          </Link>

          <p className="text-xs text-slate-400">
            © 2026 Taskly. Built for better days.
          </p>

          <Link
            href="/about"
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600"
          >
            About Taskly
          </Link>

        </div>
      </footer>

    </main>
  );
}
