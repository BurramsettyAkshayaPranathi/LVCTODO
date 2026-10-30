-- Optional Migration: Enable per-user private tasks with JWT Auth
-- Run this in your Supabase SQL Editor if you want tasks to be private per logged-in user:
-- https://supabase.com/dashboard/project/iiyslzhwwqyvcltmnwgo/sql

-- 1. Add user_id column referencing Supabase auth.users
ALTER TABLE todos 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- 2. Drop the old open policy (if it exists)
DROP POLICY IF EXISTS "Allow public all" ON todos;
DROP POLICY IF EXISTS "Users can view their own todos" ON todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON todos;

-- 3. Create per-user policies powered by Supabase JWT (auth.uid())
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

-- Also allow anonymous access for public tasks if desired:
CREATE POLICY "Allow public tasks" 
ON todos FOR ALL 
TO anon 
USING (user_id IS NULL) 
WITH CHECK (user_id IS NULL);
