"use client";

import {
  Database,
  AlertTriangle,
  Copy,
  Check,
  ShieldCheck,
  LogIn,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type Props = {
  isConfigured: boolean;
  error?: string | null;
};

const SQL_SNIPPET = `-- Run this in Supabase SQL Editor to enable private per-user tasks:
ALTER TABLE todos 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

DELETE FROM todos WHERE user_id IS NULL;

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all" ON todos;
DROP POLICY IF EXISTS "Allow public tasks" ON todos;
DROP POLICY IF EXISTS "Users can view their own todos" ON todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON todos;

CREATE POLICY "Users can view their own todos" 
ON todos FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" 
ON todos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" 
ON todos FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" 
ON todos FOR DELETE TO authenticated USING (auth.uid() = user_id);

GRANT ALL ON TABLE todos TO authenticated;`;

export default function SuperDbBanner({ isConfigured, error }: Props) {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (dismissed) return null;

  const isMissingUserId =
    error &&
    (error.includes("MISSING_USER_ID_COLUMN") ||
      error.includes("user_id") ||
      error.includes("42703"));

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. If database needs the user_id column / RLS migration
  if (isMissingUserId) {
    return (
      <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50/90 p-5 text-indigo-950 shadow-sm">
        <div className="flex items-start gap-3">
          <Database size={22} className="mt-0.5 shrink-0 text-indigo-600" />
          <div className="flex-1 text-xs sm:text-sm">
            <h4 className="font-semibold text-indigo-900">
              Enable Private Per-User Tasks in Supabase
            </h4>
            <p className="mt-1 text-indigo-800 leading-relaxed">
              To make each user&apos;s tasks strictly private so other users and
              guests cannot see them, run this SQL script in your Supabase SQL
              Editor:
            </p>
            <div className="mt-3 relative rounded-xl bg-slate-900 p-3 text-emerald-400 font-mono text-[11px] overflow-x-auto">
              <pre>{SQL_SNIPPET}</pre>
              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-2 right-2 inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded text-xs transition"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy SQL"}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-lg p-1 text-indigo-400 hover:bg-indigo-100"
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // 2. Logged in and running smoothly
  if (isConfigured && user && !error) {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-xs font-medium text-emerald-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <Database size={15} />
          <span className="flex items-center gap-1.5">
            <span>
              Signed in as <strong>{user.email}</strong>
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-emerald-200/60 px-1.5 py-0.5 text-[10px] text-emerald-900 font-mono">
              <ShieldCheck size={11} /> Private Workspace
            </span>
          </span>
        </div>
        <span className="text-emerald-700 font-mono text-[11px]">
          Cloud Synced
        </span>
      </div>
    );
  }

  // 3. Logged out guest banner
  if (isConfigured && !user && !error) {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 text-xs font-medium text-indigo-900 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <LogIn size={15} />
          </div>
          <div>
            <p className="font-semibold text-slate-800 sm:text-sm">
              You are browsing in guest mode
            </p>
            <p className="text-slate-500 text-[11px] sm:text-xs">
              Log in or sign up to create and save tasks to your private account.
            </p>
          </div>
        </div>

        <Link
          href="/auth"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
        >
          <LogIn size={13} />
          <span>Sign In / Register</span>
        </Link>
      </div>
    );
  }

  // 4. Any other error notice
  if (error) {
    return (
      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-amber-900 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
          <div className="flex-1 text-xs sm:text-sm">
            <h4 className="font-semibold text-amber-900">Database Notice</h4>
            <p className="mt-1 text-amber-800 leading-relaxed">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-lg p-1 text-amber-600 hover:bg-amber-100"
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return null;
}
