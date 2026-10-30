
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCircle2,
  LogIn,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navigation() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

        {/* LOGO */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <CheckCircle2 size={23} strokeWidth={2.5} />
          </div>

          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Taskly
            </span>
            <p className="hidden text-[10px] font-medium tracking-wide text-slate-400 sm:block">
              PLAN. FOCUS. ACHIEVE.
            </p>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* AUTHENTICATION */}
        <div className="flex items-center gap-3">
          {!loading && user ? (
            <>
              <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="max-w-[130px] truncate">
                  {user.email}
                </span>
              </div>

              <button
                type="button"
                onClick={() => signOut()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </>
          ) : !loading ? (
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 hover:shadow-lg"
            >
              <LogIn size={16} />
              Sign In
            </Link>
          ) : (
            <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
          )}
        </div>
      </div>
    </header>
  );
}
