/**
 * Authentication can be connected to Supabase independently of the product
 * integrations. This lets a staging sign-in use real accounts without making
 * the guided demo or any operational workflow depend on live data.
 */
export function isSupabaseAuthEnabled() {
  return process.env.AUTH_MODE === "supabase";
}

export function usesLiveWorkspace() {
  return process.env.INTEGRATION_MODE === "live";
}
