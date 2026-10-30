import { getSuperDbClient, isSuperDbConfigured, SUPERDB_TABLE } from "./superdb";
import type { Todo } from "@/types/todo";

function mapRowToTodo(row: Record<string, unknown>): Todo {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    completed: Boolean(row.completed),
    createdAt: String(
      row.createdAt || row.created_at || new Date().toISOString()
    ),
    userId: row.user_id ? String(row.user_id) : undefined,
  };
}

export async function fetchTodosFromDb(userId?: string): Promise<Todo[]> {
  const client = getSuperDbClient();
  if (!client) {
    throw new Error(
      "Database configuration missing. Please verify .env.local credentials."
    );
  }

  // If no user is logged in, return empty list - unauthenticated visitors do not have private tasks
  if (!userId) {
    return [];
  }

  // Attempt to query ordered by createdAt, filtered strictly by user_id
  let result = await client
    .from(SUPERDB_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("createdAt", { ascending: false });

  // If createdAt column fails (e.g. database schema uses created_at), fall back to created_at
  if (
    result.error &&
    (result.error.message.includes("createdAt") || result.error.code === "42703")
  ) {
    result = await client
      .from(SUPERDB_TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  }

  // If user_id column does not exist yet on Supabase todos table
  if (
    result.error &&
    (result.error.code === "42703" || result.error.message.includes("user_id"))
  ) {
    throw new Error(
      "MISSING_USER_ID_COLUMN: Please run schema.sql in Supabase SQL Editor to enable per-user private tasks."
    );
  }

  if (result.error) {
    if (result.error.code === "42501") {
      throw new Error(
        "Database permission notice: Please run schema.sql in Supabase SQL Editor to grant permissions."
      );
    }
    if (
      result.error.code === "PGRST205" ||
      result.error.message.includes("Could not find the table")
    ) {
      throw new Error(
        `Table "${SUPERDB_TABLE}" does not exist yet in your database. Run schema.sql in Supabase to create it.`
      );
    }
    throw new Error(result.error.message || "Failed to fetch tasks from database.");
  }

  const rows = (result.data as Record<string, unknown>[]) || [];
  return rows.map(mapRowToTodo);
}

export async function addTodoToDb(
  title: string,
  userId: string
): Promise<Todo> {
  const client = getSuperDbClient();
  if (!client) {
    throw new Error(
      "Database configuration missing. Please configure credentials in .env.local."
    );
  }

  if (!userId) {
    throw new Error("You must be logged in to create a task.");
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const payload: Record<string, unknown> = {
    id,
    title: title.trim(),
    completed: false,
    createdAt: now,
    user_id: userId,
  };

  // Try inserting with full payload
  let result = await client.from(SUPERDB_TABLE).insert([payload]).select();

  // If createdAt column doesn't exist, retry with created_at
  if (
    result.error &&
    (result.error.message.includes("createdAt") || result.error.code === "42703")
  ) {
    delete payload.createdAt;
    payload.created_at = now;
    result = await client.from(SUPERDB_TABLE).insert([payload]).select();
  }

  // If user_id column is missing
  if (
    result.error &&
    (result.error.code === "42703" || result.error.message.includes("user_id"))
  ) {
    throw new Error(
      "MISSING_USER_ID_COLUMN: Please run schema.sql in Supabase SQL Editor to add the user_id column."
    );
  }

  if (result.error) {
    if (result.error.code === "42501") {
      throw new Error(
        "Permission notice: Please run schema.sql in Supabase SQL Editor to update policies."
      );
    }
    throw new Error(result.error.message || "Failed to create task.");
  }

  const rows = (result.data as Record<string, unknown>[]) || [];
  if (rows.length > 0) {
    return mapRowToTodo(rows[0]);
  }

  return {
    id,
    title: title.trim(),
    completed: false,
    createdAt: now,
    userId,
  };
}

export async function toggleTodoInDb(
  id: string,
  completed: boolean,
  userId?: string
): Promise<Todo | null> {
  const client = getSuperDbClient();
  if (!client) {
    throw new Error("Database configuration missing.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = client.from(SUPERDB_TABLE).update({ completed }).eq("id", id);
  if (userId) {
    query = query.eq("user_id", userId);
  }

  const result = await query.select();

  if (result.error) {
    throw new Error(result.error.message || "Failed to update task.");
  }

  const rows = (result.data as Record<string, unknown>[]) || [];
  if (rows.length > 0) {
    return mapRowToTodo(rows[0]);
  }

  return null;
}

export async function deleteTodoFromDb(
  id: string,
  userId?: string
): Promise<void> {
  const client = getSuperDbClient();
  if (!client) {
    throw new Error("Database configuration missing.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = client.from(SUPERDB_TABLE).delete().eq("id", id);
  if (userId) {
    query = query.eq("user_id", userId);
  }

  const result = await query;

  if (result.error) {
    throw new Error(result.error.message || "Failed to delete task.");
  }
}

export { isSuperDbConfigured };
