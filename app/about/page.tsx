import Link from "next/link";
import { ArrowLeft, Database, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] px-4 py-10 text-slate-800">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="mb-8 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white shadow-lg">
          <div className="inline-flex rounded-xl bg-white/20 p-2.5">
            <Sparkles size={24} />
          </div>
          <h1 className="mt-4 text-3xl font-bold">About Taskly</h1>
          <p className="mt-2 text-purple-100 text-sm sm:text-base">
            Modern task management built with Next.js and backed by SuperDB for
            secure, real-time cloud data persistence.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <Database size={20} />
            </div>
            <h3 className="font-bold text-slate-900">SuperDB Storage</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Replaces fragile browser localStorage with a reliable cloud database.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-slate-900">Optimistic UI</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Instant feedback on adding, toggling, and removing tasks.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex rounded-xl bg-purple-50 p-2 text-purple-600">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-900">Type-Safe Schema</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Full TypeScript definitions and resilient column mapping.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
