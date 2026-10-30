import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createSuperDbClient } from "@superdb/client";

function extractSupabaseRefFromJwt(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length >= 2) {
      const payload = JSON.parse(
        Buffer.from(parts[1], "base64").toString("utf-8")
      );
      if (payload.iss === "supabase" && payload.ref) {
        return payload.ref;
      }
    }
  } catch {
    // If not a valid JWT or browser context with atob
    try {
      if (typeof atob !== "undefined") {
        const parts = token.split(".");
        if (parts.length >= 2) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.iss === "supabase" && payload.ref) {
            return payload.ref;
          }
        }
      }
    } catch {
      // Ignore parse failure
    }
  }
  return null;
}

const rawAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPERDB_ANON_KEY ||
  "";

const rawProject =
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT ||
  process.env.NEXT_PUBLIC_SUPERDB_PROJECT ||
  "";

let resolvedUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPERDB_URL ||
  "";

// If user supplied a Supabase JWT anon key, auto-detect the Supabase project URL
const jwtRef = extractSupabaseRefFromJwt(rawAnonKey);
if (jwtRef) {
  resolvedUrl = `https://${jwtRef}.supabase.co`;
} else if (rawProject && !resolvedUrl.includes("://") && !resolvedUrl.includes("supabase.co")) {
  // If user entered project ID without full URL
  if (rawProject.length >= 15 && !rawProject.includes(" ")) {
    resolvedUrl = `https://${rawProject}.supabase.co`;
  }
}

export const SUPERDB_TABLE =
  process.env.NEXT_PUBLIC_SUPERDB_TABLE ||
  process.env.NEXT_PUBLIC_SUPABASE_TABLE ||
  "todos";

export function isSuperDbConfigured(): boolean {
  return Boolean(
    resolvedUrl &&
      resolvedUrl.trim() !== "" &&
      rawAnonKey &&
      rawAnonKey.trim() !== ""
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let clientInstance: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSuperDbClient(): any {
  if (!isSuperDbConfigured()) {
    return null;
  }

  if (!clientInstance) {
    if (resolvedUrl.includes("supabase.co") || jwtRef) {
      clientInstance = createSupabaseClient(resolvedUrl, rawAnonKey);
    } else {
      clientInstance = createSuperDbClient(resolvedUrl, rawAnonKey, {
        project: rawProject,
      });
    }
  }

  return clientInstance;
}
