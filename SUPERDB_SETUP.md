# SuperDB Integration Guide for Taskly

This Next.js application has been converted to use **SuperDB** (`@superdb/client`) instead of browser `localStorage`.

---

## 1. Quick Setup

### Step A: Configure Environment Variables
Open `.env.local` and add your SuperDB project details:

```bash
NEXT_PUBLIC_SUPERDB_URL=https://auth.superdb.com.br
NEXT_PUBLIC_SUPERDB_PROJECT=your-project-slug
NEXT_PUBLIC_SUPERDB_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPERDB_TABLE=todos
```

- **`NEXT_PUBLIC_SUPERDB_PROJECT`**: The slug of your SuperDB project (required by SuperDB to route `.from()` table queries).
- **`NEXT_PUBLIC_SUPERDB_ANON_KEY`**: Your SuperDB anonymous public API key.
- **`NEXT_PUBLIC_SUPERDB_URL`**: Base URL for SuperDB Auth & Data plane (defaults to `https://auth.superdb.com.br`).
- **`NEXT_PUBLIC_SUPERDB_TABLE`**: Table name for tasks (defaults to `todos`).

---

## 2. Database Table Schema

In your SuperDB project console / PostgreSQL editor, run the following SQL script from `schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

*(Note: The application's data mapper is resilient and also automatically supports `created_at` in snake_case if your table uses standard Postgres naming).*

---

## 3. Architecture & Code Structure

- **`lib/superdb.ts`**: Initializes the SuperDB client using `createClient` from `@superdb/client` and verifies credentials.
- **`lib/todoService.ts`**: Handles all CRUD queries with SuperDB:
  - `fetchTodosFromDb()`: Retrieves tasks ordered by creation date.
  - `addTodoToDb(title)`: Inserts a new task using `.insert().select()`.
  - `toggleTodoInDb(id, completed)`: Updates task completion state using `.update().select()`.
  - `deleteTodoFromDb(id)`: Removes task with `.delete().eq()`.
- **`hooks/useTodos.ts`**: React custom hook managing state, optimistic updates (instant feedback), error handling, and cross-tab synchronization.
- **`components/SuperDbBanner.tsx`**: Dynamic indicator displaying connection status and setup notifications.
- **`app/page.tsx`**: Main dashboard showing tasks, statistics, and filters.
- **`app/todos/page.tsx`**: Dedicated view for active tasks.
- **`app/completed/page.tsx`**: Completed tasks overview with restore and permanent delete actions.
