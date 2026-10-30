"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, user, signOut } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg("Successfully logged in! Redirecting...");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        }
      } else {
        const { error, user: newUser } = await signUp(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else if (newUser && newUser.identities && newUser.identities.length === 0) {
          setErrorMsg("An account with this email already exists.");
        } else {
          setSuccessMsg(
            "Account registered successfully! You are now logged in with your JWT session."
          );
          setTimeout(() => {
            router.push("/");
          }, 1200);
        }
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={16} />
          Back to Tasks
        </Link>

        <div className="rounded-3xl border border-slate-100 bg-white p-7 sm:p-9 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
              <KeyRound size={22} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {user
                ? "Account Dashboard"
                : mode === "login"
                ? "Welcome back"
                : "Create an account"}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {user
                ? "You are currently signed in with JWT authentication"
                : "Secure JWT Authentication via Supabase"}
            </p>
          </div>

          {user ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-900 text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span>Logged in as:</span>
                </div>
                <p className="mt-1 font-mono text-emerald-800 break-all">
                  {user.email}
                </p>
                <p className="mt-2 text-[11px] text-emerald-600">
                  User ID: {user.id}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/"
                  className="flex-1 rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Go to Tasks
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Mode switch tabs */}
              <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                    mode === "login"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                    mode === "signup"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-700">
                  <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                  <p>{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60"
                >
                  {submitting
                    ? "Processing..."
                    : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-4 text-center">
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                  <Sparkles size={12} className="text-indigo-500" />
                  JWT tokens managed securely with Supabase Auth
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
