"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { getSuperDbClient } from "@/lib/superdb";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null; user: User | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  token: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      const supabase = getSuperDbClient();
      if (!supabase || !supabase.auth) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(data?.session ?? null);
          setUser(data?.session?.user ?? null);
        }
      } catch {
        // ignore session retrieval error
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSession();

    const supabase = getSuperDbClient();
    if (!supabase || !supabase.auth) return;

    const {
      data: { subscription },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSuperDbClient();
    if (!supabase || !supabase.auth) {
      return {
        error: {
          name: "ClientError",
          message: "Database client is not configured.",
        } as AuthError,
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.session) {
      setSession(data.session);
      setUser(data.user);
    }

    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const supabase = getSuperDbClient();
    if (!supabase || !supabase.auth) {
      return {
        error: {
          name: "ClientError",
          message: "Database client is not configured.",
        } as AuthError,
        user: null,
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.session) {
      setSession(data.session);
      setUser(data.user);
    }

    return { error, user: data.user };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSuperDbClient();
    if (supabase && supabase.auth) {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        token: session?.access_token ?? null,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
