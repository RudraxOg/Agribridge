import "server-only";
import { createHash } from "node:crypto";

type WindowEntry = { count: number; resetsAt: number };
const windows = new Map<string, WindowEntry>();

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number; remaining: number };

export function privacyKey(parts: readonly string[]) {
  return createHash("sha256").update(parts.map((part) => part.trim().toLowerCase()).join("\u001f")).digest("hex");
}

export function checkLocalRateLimit(namespace: string, subjectHash: string, limit = 5, windowMs = 60_000, now = Date.now()): RateLimitResult {
  const key = `${namespace}:${subjectHash}`;
  const current = windows.get(key);
  const entry = !current || current.resetsAt <= now ? { count: 0, resetsAt: now + windowMs } : current;
  entry.count += 1;
  windows.set(key, entry);
  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetsAt - now) / 1000)),
  };
}

export function resetLocalRateLimitsForTests() { windows.clear(); }
