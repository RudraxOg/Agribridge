import { NextResponse } from "next/server";
import { getLatestAndroidRelease } from "@/lib/mobile-releases/get-latest-android-release";
import { usesLiveWorkspace } from "@/lib/auth/auth-mode";
import { createAdminClient } from "@/lib/supabase/admin";
import { publishedAndroidApkUrl } from "@/lib/mobile-releases/published-android-release";
import { checkLocalRateLimit, privacyKey } from "@/lib/security/rate-limit";
type DownloadQuery = {
  select(columns: string): DownloadQuery;
  eq(column: string, value: string): DownloadQuery;
  maybeSingle(): Promise<{ data: unknown }>;
};
export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limited = checkLocalRateLimit(
    "android-download",
    privacyKey([ip]),
    12,
    60_000,
  );
  if (!limited.allowed)
    return NextResponse.json(
      { error: "Please try again shortly" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      },
    );
  const state = await getLatestAndroidRelease();
  if (!state.release)
    return NextResponse.json(
      { error: "No Android release is available" },
      { status: 404 },
    );
  if (!usesLiveWorkspace())
    return NextResponse.redirect(publishedAndroidApkUrl, {
      headers: {
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
      },
    });
  const admin = createAdminClient();
  const releases = (admin.from as unknown as (table: string) => DownloadQuery)(
    "mobile_app_releases",
  );
  const { data } = await releases
    .select("apk_download_url")
    .eq("id", state.release.id)
    .maybeSingle();
  const url = (data as { apk_download_url?: string | null } | null)
    ?.apk_download_url;
  if (!url || !url.startsWith("https://"))
    return NextResponse.json(
      { error: "The official Android file is not configured" },
      { status: 503 },
    );
  await (
    admin.rpc as unknown as (
      fn: string,
      args: Record<string, string>,
    ) => Promise<unknown>
  )("record_mobile_release_download", {
    target_release_id: state.release.id,
  });
  return NextResponse.redirect(url, {
    headers: {
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
