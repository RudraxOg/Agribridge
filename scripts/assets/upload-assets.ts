import { createReadStream } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import * as tus from "tus-js-client";
import { root } from "./common";

const dryRun = process.argv.includes("--dry-run");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const definitions = [
  ["public-brand-assets", true], ["public-listing-media", true], ["private-stock-originals", false],
  ["grading-certificates", false], ["delivery-proofs", false], ["dispute-evidence", false],
] as const;

type PlannedFile = { localPath: string; bucket: string; objectPath: string; contentType: string; cacheControl: string };
async function walk(directory: string): Promise<string[]> {
  try { return (await Promise.all((await readdir(directory)).map(async (name) => { const target = path.join(directory, name); return (await stat(target)).isDirectory() ? walk(target) : [target]; }))).flat(); } catch { return []; }
}
const generated = await walk(path.join(root, "assets/generated"));
const processed = await walk(path.join(root, "assets/processed"));
const stockPhotos = await walk(path.join(root, "public/stocks"));
const inputs = [
  ...generated.map((localPath) => ({ localPath, base: path.join(root, "assets/generated"), prefix: "" })),
  ...processed.map((localPath) => ({ localPath, base: path.join(root, "assets/processed"), prefix: "" })),
  ...stockPhotos.map((localPath) => ({ localPath, base: path.join(root, "public/stocks"), prefix: "stocks/" })),
];
const plans: PlannedFile[] = inputs.filter(({ localPath }) => !localPath.endsWith("index.json") && !localPath.endsWith("seed-media.sql")).map(({ localPath, base, prefix }) => {
  const relative = `${prefix}${path.relative(base, localPath).replaceAll(path.sep, "/")}`;
  const ext = path.extname(localPath).toLowerCase();
  const contentType = ext === ".svg" ? "image/svg+xml" : ext === ".webp" ? "image/webp" : ext === ".avif" ? "image/avif" : [".jpg", ".jpeg"].includes(ext) ? "image/jpeg" : ext === ".pdf" ? "application/pdf" : "application/octet-stream";
  const bucket = relative.startsWith("brand/") || relative.startsWith("illustrations/") || relative.startsWith("vehicles/") ? "public-brand-assets" : relative.startsWith("documents/grading") ? "grading-certificates" : relative.startsWith("documents/") ? "delivery-proofs" : "public-listing-media";
  return { localPath, bucket, objectPath: `demo/${relative}`, contentType, cacheControl: bucket.startsWith("public-") ? "31536000" : "3600" };
});

if (dryRun) {
  for (const plan of plans) console.log(`[dry-run] ${plan.bucket}/${plan.objectPath} (${plan.contentType})`);
  console.log(`Dry run complete: ${plans.length} files, no network changes.`);
  process.exit(0);
}
if (!supabaseUrl || !serviceKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (use --dry-run without credentials)");
const requiredUrl = supabaseUrl;
const requiredKey = serviceKey;
const supabase = createClient(requiredUrl, requiredKey, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: existingBuckets, error: bucketError } = await supabase.storage.listBuckets();
if (bucketError) throw bucketError;
for (const [id, isPublic] of definitions) if (!existingBuckets.some((bucket) => bucket.id === id)) {
  const { error } = await supabase.storage.createBucket(id, { public: isPublic });
  if (error) throw error;
}

async function tusUpload(plan: PlannedFile, size: number) {
  const file = createReadStream(plan.localPath);
  await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, { endpoint: `${requiredUrl}/storage/v1/upload/resumable`, headers: { authorization: `Bearer ${requiredKey}`, apikey: requiredKey }, metadata: { bucketName: plan.bucket, objectName: plan.objectPath, contentType: plan.contentType, cacheControl: plan.cacheControl }, uploadSize: size, retryDelays: [0, 1_000, 3_000, 5_000], onError: reject, onSuccess: () => resolve() });
    upload.start();
  });
}

for (const plan of plans) {
  const directory = path.posix.dirname(plan.objectPath);
  const filename = path.posix.basename(plan.objectPath);
  const { data: existing } = await supabase.storage.from(plan.bucket).list(directory, { search: filename, limit: 1 });
  if (existing?.some((item) => item.name === filename)) { console.log(`Exists ${plan.bucket}/${plan.objectPath}`); continue; }
  const size = (await stat(plan.localPath)).size;
  if (size > 6 * 1024 * 1024) await tusUpload(plan, size);
  else {
    const bytes = await readFile(plan.localPath);
    const { error } = await supabase.storage.from(plan.bucket).upload(plan.objectPath, bytes, { contentType: plan.contentType, cacheControl: plan.cacheControl, upsert: false });
    if (error) throw error;
  }
  console.log(`Uploaded ${plan.bucket}/${plan.objectPath}`);
}
