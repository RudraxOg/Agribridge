import { existsSync, readFileSync } from "node:fs";
import process from "node:process";

const requiredNode = [20, 9];
const actual = process.versions.node.split(".").map(Number);
const nodeIsSupported = actual[0] > requiredNode[0] || (actual[0] === requiredNode[0] && actual[1] >= requiredNode[1]);

if (!nodeIsSupported) {
  console.error(`AgriBridge requires Node.js ${requiredNode.join(".")} or newer (found ${process.versions.node}).`);
  process.exit(1);
}

if (!existsSync("node_modules")) {
  console.error("Dependencies are missing. Run: pnpm install");
  process.exit(1);
}

if (!existsSync(".env.local")) {
  console.error(".env.local is missing. Run: cp .env.example .env.local");
  process.exit(1);
}

const env = readFileSync(".env.local", "utf8");
const requiredDefaults = ["INTEGRATION_MODE=mock", "PAYMENT_PROVIDER=mock"];
const missingDefaults = requiredDefaults.filter((entry) => !env.split(/\r?\n/).some((line) => line.trim() === entry));
if (missingDefaults.length) {
  console.error(`Local safety defaults are missing from .env.local: ${missingDefaults.join(", ")}`);
  process.exit(1);
}

const values = Object.fromEntries(
  env
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1)];
    }),
);

const supabaseUrl = values.NEXT_PUBLIC_SUPABASE_URL;
const publicSupabaseKey = values.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || values.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !publicSupabaseKey) {
  console.error("Supabase public configuration is incomplete. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or the legacy ANON_KEY).");
  process.exit(1);
}

try {
  const parsedSupabaseUrl = new URL(supabaseUrl);
  if (!["http:", "https:"].includes(parsedSupabaseUrl.protocol)) throw new Error("unsupported protocol");
  if (parsedSupabaseUrl.hostname.endsWith(".vercel.app")) {
    throw new Error("Vercel deployment URLs are application origins, not Supabase API endpoints");
  }
} catch (error) {
  const reason = error instanceof Error ? error.message : "invalid URL";
  console.error(`NEXT_PUBLIC_SUPABASE_URL is invalid: ${reason}. Use your Supabase Project URL (for example, https://<project-ref>.supabase.co).`);
  process.exit(1);
}

console.log(`Local setup looks ready (Node ${process.versions.node}, mock integrations enabled).`);
