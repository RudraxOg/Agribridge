"use client";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import type { AndroidRelease } from "@/lib/mobile-releases/types";
export function AndroidReleaseDetails({
  release,
}: {
  release: AndroidRelease;
}) {
  const copy = async () => {
    await navigator.clipboard?.writeText(release.sha256);
    toast.success("SHA-256 copied");
  };
  return (
    <div className="mt-4 grid gap-2 rounded-xl border border-[var(--border)] p-4 text-sm">
      <p>
        <strong>Version:</strong> {release.version} ({release.versionCode})
      </p>
      <p>
        <strong>Release date:</strong>{" "}
        {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
          new Date(release.publishedAt),
        )}
      </p>
      <p>
        <strong>APK size:</strong>{" "}
        {(release.fileSizeBytes / 1_000_000).toFixed(1)} MB ·{" "}
        <strong>Android:</strong> {release.minAndroidSdk}+
      </p>
      <button
        type="button"
        onClick={copy}
        className="flex min-h-11 items-center gap-2 text-left text-xs break-all text-[var(--text-muted)]"
      >
        <Copy aria-hidden size={16} />
        SHA-256: {release.sha256}
      </button>
    </div>
  );
}
