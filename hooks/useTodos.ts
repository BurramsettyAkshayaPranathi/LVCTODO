"use client";

import { useCallback, useEffect, useState } from "react";
import type { Todo } from "@/types/todo";
import { useAuth } from "@/context/AuthContext";
import {
  fetchTodosFromDb,
  addTodoToDb,
  toggleTodoInDb,
  deleteTodoFromDb,
  isSuperDbConfigured,
} from "@/lib/todoService";

const SYNC_EVENT_NAME = "taskly-todos-updated";

export function useTodos() {
  const { user, loading: authLoading } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isConfigured = isSuperDbConfigured();

  const loadTodos = useCallback(async () => {
    // Wait until auth state is known
    if (authLoading) return;

    setError(null);

    // If user is logged out, clear all tasks immediately - no private tasks shown
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await fetchTodosFromDb(user.id);
      setTodos(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load tasks from database.";
      setError(msg);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    let isMounted = true;

    async function initialLoad() {
      if (authLoading) return;

      if (!user) {
        if (isMounted) {
          setTodos([]);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await fetchTodosFromDb(user.id);
        if (isMounted) {
          setTodos(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to load tasks from database.";
          setError(msg);
          setTodos([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initialLoad();

    function handleSync() {
      loadTodos();
    }

    window.addEventListener(SYNC_EVENT_NAME, handleSync);
    return () => {
      isMounted = false;
      window.removeEventListener(SYNC_EVENT_NAME, handleSync);
    };
  }, [loadTodos, user?.id, authLoading, user]);

  const notifyChange = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME));
    }
  };

  const addTodo = async (title: string) => {
    if (!title.trim()) return;

    if (!user) {
      setError("Please sign in or create an account to add your personal tasks.");
      return;
    }

    setError(null);
    const tempId = crypto.randomUUID();
    const tempTodo: Todo = {
      id: tempId,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      userId: user.id,
    };

    // Optimistic UI update
    setTodos((prev) => [tempTodo, ...prev]);

    try {
      const savedTodo = await addTodoToDb(title, user.id);
      setTodos((prev) =>
        prev.map((item) => (item.id === tempId ? savedTodo : item))
      );
      notifyChange();
    } catch (err: unknown) {
      // Revert optimistic update
      setTodos((prev) => prev.filter((item) => item.id !== tempId));
      const msg =
        err instanceof Error ? err.message : "Failed to add task.";
      setError(msg);
    }
  };

  const toggleTodo = async (id: string) => {
    setError(null);
    const current = todos.find((t) => t.id === id);
    if (!current) return;

    const nextCompleted = !current.completed;

    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );

    try {
      await toggleTodoInDb(id, nextCompleted, user?.id);
      notifyChange();
    } catch (err: unknown) {
      // Revert on error
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: current.completed } : t
        )
      );
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to update task in database.";
      setError(msg);
    }
  };

  const deleteTodo = async (id: string) => {
    setError(null);
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    // Optimistic UI update
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTodoFromDb(id, user?.id);
      notifyChange();
    } catch (err: unknown) {
      // Revert on error
      setTodos((prev) => [target, ...prev]);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to delete task from database.";
      setError(msg);
    }
  };

  return {
    todos,
    loading: loading || authLoading,
    error,
    isConfigured,
    user,
    addTodo,
    toggleTodo,
    deleteTodo,
    refreshTodos: loadTodos,
  };
}
