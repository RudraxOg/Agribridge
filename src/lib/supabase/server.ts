import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.generated";
import { isSupabaseAuthEnabled, usesLiveWorkspace } from "@/lib/auth/auth-mode";

async function createSupabaseServerClient() {
  const store = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Public Supabase variables are missing");
  return createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(values) {
        try { values.forEach(({ name, value, options }) => store.set(name, value, options)); } catch {}
      },
    },
  });
}

/** Use only for protected workspace data, storage, and RLS operations. */
export async function createClient() {
  if (!usesLiveWorkspace()) throw new Error("Supabase workspace access is disabled while INTEGRATION_MODE=mock");
  return createSupabaseServerClient();
}

/** Use only in authentication handlers when AUTH_MODE=supabase. */
export async function createAuthClient() {
  if (!isSupabaseAuthEnabled()) throw new Error("Supabase authentication is disabled while AUTH_MODE=mock");
  return createSupabaseServerClient();
}
