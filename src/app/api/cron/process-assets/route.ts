import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createListingDerivative } from "@/integrations/media/image-derivatives";
import { fileScanner } from "@/integrations/security/file-scanner";
import { env } from "@/lib/config/env";
import { listingDerivativePath, sniffMime } from "@/lib/storage/asset-policy";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/types/database.generated";

type JobType = "mime_verify" | "malware_scan" | "image_derivatives" | "metadata_strip";
type Job = { id: string; file_asset_id: string; job_type: JobType; attempts: number };
type Asset = {
  id: string;
  owner_organization_id: string | null;
  bucket: string;
  object_path: string;
  mime_type: string;
  checksum_sha256: string;
  purpose: string;
  processing_status: string;
  quarantine_status: string;
  scan_provider: string | null;
  scanned_at: string | null;
  alt_text: unknown;
  metadata: unknown;
};

const jobRank: Record<JobType, number> = { mime_verify: 0, malware_scan: 1, metadata_strip: 2, image_derivatives: 2 };
const uuid = z.string().uuid();

function objectMetadata(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

async function dependenciesReady(admin: ReturnType<typeof createAdminClient>, job: Job, asset: Asset) {
  if (job.job_type === "mime_verify") return true;
  const { data } = await admin.from("processing_jobs").select("job_type,status").eq("file_asset_id", job.file_asset_id);
  const statuses = new Map((data ?? []).map((item) => [item.job_type, item.status]));
  if (statuses.get("mime_verify") !== "succeeded") return false;
  if (job.job_type === "malware_scan") return true;
  return statuses.get("malware_scan") === "succeeded" && asset.quarantine_status === "clean";
}

async function postponeJob(admin: ReturnType<typeof createAdminClient>, job: Job) {
  await admin.from("processing_jobs").update({
    status: "queued",
    attempts: Math.max(0, job.attempts - 1),
    available_at: new Date(Date.now() + 5_000).toISOString(),
    locked_at: null,
    updated_at: new Date().toISOString(),
  }).eq("id", job.id);
}

async function failRemainingJobs(admin: ReturnType<typeof createAdminClient>, assetId: string, status: "failed" | "quarantined", errorCode: string) {
  await admin.from("processing_jobs").update({ status, error_code: errorCode, updated_at: new Date().toISOString() })
    .eq("file_asset_id", assetId).in("status", ["queued", "processing"]);
}

async function createAndBindDerivative(admin: ReturnType<typeof createAdminClient>, asset: Asset, source: Uint8Array) {
  if (asset.purpose !== "listing-original" || !asset.owner_organization_id) throw new Error("listing_source_invalid");
  const [organizationId, lotId] = asset.object_path.split("/");
  if (!uuid.safeParse(organizationId).success || !uuid.safeParse(lotId).success || organizationId !== asset.owner_organization_id) throw new Error("listing_path_invalid");
  const { data: lot } = await admin.from("stock_lots").select("id").eq("id", lotId).eq("organization_id", organizationId).maybeSingle();
  if (!lot) throw new Error("listing_lot_missing");

  const { data: bindings } = await admin.from("stock_lot_assets").select("file_asset_id,position,is_cover").eq("stock_lot_id", lotId).order("position", { ascending: false });
  const isCover = !bindings?.length;
  const position = isCover ? 0 : Math.max(...bindings.map((item) => Number(item.position))) + 1;
  const variant = isCover ? "cover" : "gallery";
  const objectPath = listingDerivativePath({ organizationId, lotId, assetId: asset.id, variant, width: 1280 });
  const derivative = await createListingDerivative(source);
  const bucket = "public-listing-media";
  const { error: uploadError } = await admin.storage.from(bucket).upload(objectPath, derivative.bytes, {
    cacheControl: "31536000",
    contentType: derivative.mimeType,
    upsert: true,
  });
  if (uploadError) throw new Error("derivative_upload_failed");

  let derivativeId: string = randomUUID();
  let createdDerivativeRecord = true;
  const { error: insertError } = await admin.from("file_assets").insert({
    id: derivativeId,
    owner_organization_id: organizationId,
    bucket,
    object_path: objectPath,
    original_filename: `${asset.id}-1280.webp`,
    mime_type: derivative.mimeType,
    byte_size: derivative.bytes.byteLength,
    width: derivative.width,
    height: derivative.height,
    checksum_sha256: derivative.checksumSha256,
    visibility: "public",
    purpose: "listing-derivative",
    processing_status: "ready",
    quarantine_status: "clean",
    scan_provider: asset.scan_provider,
    scanned_at: asset.scanned_at,
    retention_expires_at: new Date(Date.now() + 730 * 86_400_000).toISOString(),
    is_synthetic: false,
    alt_text: asset.alt_text as Json,
    metadata: { source_asset_id: asset.id, variant, width: derivative.width, metadata_stripped: true },
  });
  if (insertError) {
    const { data: existing } = await admin.from("file_assets").select("id,object_path").eq("owner_organization_id", organizationId).eq("bucket", bucket).eq("checksum_sha256", derivative.checksumSha256).maybeSingle();
    if (!existing) {
      await admin.storage.from(bucket).remove([objectPath]);
      throw new Error("derivative_metadata_failed");
    }
    createdDerivativeRecord = false;
    derivativeId = existing.id;
    if (existing.object_path !== objectPath) await admin.storage.from(bucket).remove([objectPath]);
  }

  const alreadyBound = bindings?.some((item) => item.file_asset_id === derivativeId);
  if (!alreadyBound) {
    const { error: bindingError } = await admin.from("stock_lot_assets").insert({ organization_id: organizationId, stock_lot_id: lotId, file_asset_id: derivativeId, position, is_cover: isCover });
    if (bindingError) {
      if (createdDerivativeRecord) {
        await admin.from("file_assets").delete().eq("id", derivativeId);
        await admin.storage.from(bucket).remove([objectPath]);
      }
      throw new Error("derivative_binding_failed");
    }
  }
}

export async function POST(request: Request) {
  if (!env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("claim_processing_jobs", { max_jobs: 5 });
  if (error) return NextResponse.json({ error: "Could not claim processing jobs" }, { status: 503 });
  const jobs = ((data ?? []) as unknown as Job[]).sort((left, right) => jobRank[left.job_type] - jobRank[right.job_type]);
  let succeeded = 0;
  let rejected = 0;
  let failed = 0;
  let deferred = 0;

  for (const job of jobs) {
    const { data: record } = await admin.from("file_assets").select("id,owner_organization_id,bucket,object_path,mime_type,checksum_sha256,purpose,processing_status,quarantine_status,scan_provider,scanned_at,alt_text,metadata").eq("id", job.file_asset_id).maybeSingle();
    const asset = record as unknown as Asset | null;
    if (!asset) {
      await admin.from("processing_jobs").update({ status: "failed", error_code: "asset_missing", updated_at: new Date().toISOString() }).eq("id", job.id);
      failed++;
      continue;
    }
    if (!(await dependenciesReady(admin, job, asset))) {
      if (asset.quarantine_status === "rejected") {
        await failRemainingJobs(admin, asset.id, "quarantined", "scanner_rejected");
        rejected++;
      } else if (asset.processing_status === "failed") {
        await failRemainingJobs(admin, asset.id, "failed", "dependency_failed");
        failed++;
      } else {
        await postponeJob(admin, job);
        deferred++;
      }
      continue;
    }

    try {
      const { data: download, error: downloadError } = await admin.storage.from(asset.bucket).download(asset.object_path);
      if (downloadError || !download) throw new Error("download_failed");
      const bytes = new Uint8Array(await download.arrayBuffer());
      if (job.job_type === "mime_verify") {
        const detected = sniffMime(bytes.subarray(0, 32));
        const heic = [detected, asset.mime_type].every((mime) => mime === "image/heic" || mime === "image/heif");
        if (!detected || (detected !== asset.mime_type && !heic)) throw new Error("mime_mismatch");
        const checksum = createHash("sha256").update(bytes).digest("hex");
        if (checksum !== asset.checksum_sha256) throw new Error("checksum_mismatch");
        await admin.from("file_assets").update({ metadata: { ...objectMetadata(asset.metadata), checksum_state: "server-verified" } }).eq("id", asset.id);
      } else if (job.job_type === "malware_scan") {
        const result = await fileScanner().scan(bytes, asset.mime_type);
        if (!result.clean) {
          await admin.from("file_assets").update({ processing_status: "quarantined", quarantine_status: "rejected", scan_provider: result.provider, scanned_at: new Date().toISOString() }).eq("id", asset.id);
          await failRemainingJobs(admin, asset.id, "quarantined", result.reason ?? "scanner_rejected");
          rejected++;
          continue;
        }
        await admin.from("file_assets").update({ quarantine_status: "clean", scan_provider: result.provider, scanned_at: new Date().toISOString() }).eq("id", asset.id);
      } else if (asset.purpose === "listing-original") {
        await createAndBindDerivative(admin, { ...asset, quarantine_status: "clean" }, bytes);
      }

      await admin.from("processing_jobs").update({ status: "succeeded", error_code: null, updated_at: new Date().toISOString() }).eq("id", job.id);
      const { count } = await admin.from("processing_jobs").select("id", { count: "exact", head: true }).eq("file_asset_id", asset.id).in("status", ["queued", "processing", "failed"]);
      if (count === 0) await admin.from("file_assets").update({ processing_status: "ready" }).eq("id", asset.id).eq("quarantine_status", "clean");
      succeeded++;
    } catch (reason) {
      const code = reason instanceof Error ? reason.message.slice(0, 80) : "processing_failed";
      await failRemainingJobs(admin, asset.id, "failed", code);
      await admin.from("file_assets").update({ processing_status: "failed" }).eq("id", asset.id);
      failed++;
    }
  }
  return NextResponse.json({ claimed: jobs.length, succeeded, rejected, failed, deferred, mockScanner: env.INTEGRATION_MODE === "mock" });
}
