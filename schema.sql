-- =================================================================
-- Taskly Database Schema: Private Per-User Tasks with Supabase JWT
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/iiyslzhwwqyvcltmnwgo/sql
-- =================================================================

-- 1. Ensure todos table exists with user_id
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Add user_id column referencing Supabase auth.users
ALTER TABLE todos 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- 3. Delete any previous test tasks that don't belong to any user
DELETE FROM todos WHERE user_id IS NULL;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 5. Drop any legacy open policies
DROP POLICY IF EXISTS "Allow public all" ON todos;
DROP POLICY IF EXISTS "Allow public tasks" ON todos;
DROP POLICY IF EXISTS "Users can view their own todos" ON todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON todos;

-- 6. Create secure per-user policies: each user can ONLY access their own tasks
CREATE POLICY "Users can view their own todos" 
ON todos FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" 
ON todos FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" 
ON todos FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" 
ON todos FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 7. Grant full access on todos table to authenticated users
GRANT ALL ON TABLE todos TO authenticated;
