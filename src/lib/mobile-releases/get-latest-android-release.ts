import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { usesLiveWorkspace } from "@/lib/auth/auth-mode";
import { publishedAndroidRelease } from "./published-android-release";
import type { AndroidReleaseState } from "./types";

type ReleaseQuery = {
  select(columns: string): ReleaseQuery;
  eq(column: string, value: string): ReleaseQuery;
  not(column: string, operator: string, value: null): ReleaseQuery;
  order(column: string, options: { ascending: boolean }): ReleaseQuery;
  limit(count: number): ReleaseQuery;
  maybeSingle(): Promise<{ data: unknown }>;
};

export async function getLatestAndroidRelease(): Promise<AndroidReleaseState> {
  if (!usesLiveWorkspace())
    return { release: publishedAndroidRelease, unavailable: false };
  const admin = createAdminClient();
  const releases = (admin.from as unknown as (table: string) => ReleaseQuery)(
    "mobile_app_releases",
  );
  const { data } = await releases
    .select(
      "id,version_name,version_code,file_size_bytes,min_android_sdk,sha256,release_notes,published_at",
    )
    .eq("platform", "android")
    .eq("channel", "stable")
    .eq("status", "published")
    .not("published_at", "is", null)
    .not("apk_download_url", "is", null)
    .order("published_at", { ascending: false })
    .order("version_code", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return { release: null, unavailable: true };
  const row = data as unknown as {
    id: string;
    version_name: string;
    version_code: number;
    file_size_bytes: number;
    min_android_sdk: number;
    sha256: string;
    release_notes: unknown;
    published_at: string;
  };
  return {
    release: {
      id: row.id,
      version: row.version_name,
      versionCode: row.version_code,
      fileSizeBytes: row.file_size_bytes,
      minAndroidSdk: row.min_android_sdk,
      sha256: row.sha256,
      releaseNotes: Array.isArray(row.release_notes)
        ? row.release_notes.filter(
            (note): note is string => typeof note === "string",
          )
        : [],
      publishedAt: row.published_at,
      downloadUrl: "/api/download/android",
    },
    unavailable: false,
  };
}
