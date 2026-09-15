import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileTypeFromBuffer } from "./magic";
import { ensureDirectory, readManifest, root, sha256, writeManifest } from "./common";

const entries = await readManifest();
const originals = path.join(root, "assets/originals");
await ensureDirectory(originals);
const maxBytes = 20 * 1024 * 1024;

for (const entry of entries.filter((item) => item.status === "approved")) {
  const extension = new URL(entry.downloadUrl).pathname.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "bin";
  const output = path.join(originals, `${entry.slug}.${extension}`);
  try {
    const cached = await readFile(output);
    entry.checksumSha256 = sha256(cached);
    console.log(`Cached ${entry.slug}`);
    continue;
  } catch { /* download below */ }
  const response = await fetch(entry.downloadUrl, { headers: { "user-agent": process.env.ASSET_PIPELINE_USER_AGENT ?? "AgriBridgePrototype/1.0 contact@example.com" }, signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`${entry.slug}: download returned ${response.status}`);
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > maxBytes) throw new Error(`${entry.slug}: exceeds 20 MB maximum`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > maxBytes) throw new Error(`${entry.slug}: exceeds 20 MB maximum`);
  const detected = fileTypeFromBuffer(bytes);
  const claimed = response.headers.get("content-type")?.split(";")[0];
  if (!detected || !detected.startsWith("image/") || (claimed && claimed !== "application/octet-stream" && claimed !== detected)) throw new Error(`${entry.slug}: unsafe or mismatched content type`);
  await writeFile(output, bytes, { flag: "wx" });
  entry.checksumSha256 = sha256(bytes);
  console.log(`Downloaded ${entry.slug} (${bytes.byteLength} bytes)`);
}
await writeManifest(entries);
