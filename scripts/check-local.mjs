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

console.log(`Local setup looks ready (Node ${process.versions.node}, mock integrations enabled).`);
