import "server-only";

/**
 * Deliberately fixed credentials for the local/mock demonstration only.
 * Live Supabase authentication never reads these values.
 */
export const demoAuthCredentials = {
  username: process.env.DEMO_AUTH_USERNAME ?? "test.username",
  password: process.env.DEMO_AUTH_PASSWORD ?? "test.password",
} as const;
