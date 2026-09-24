import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.generated";
import { usesLiveWorkspace } from "@/lib/auth/auth-mode";

export function createAdminClient() {
  if (!usesLiveWorkspace()) throw new Error("Supabase administrator access is disabled while INTEGRATION_MODE=mock");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Server-side Supabase administrator variables are missing");
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
