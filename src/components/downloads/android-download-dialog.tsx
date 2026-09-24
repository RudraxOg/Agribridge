"use client";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Download, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AndroidRelease } from "@/lib/mobile-releases/types";
import { AndroidInstallSteps } from "./android-install-steps";
import { AndroidReleaseDetails } from "./android-release-details";
export function AndroidDownloadDialog({
  open,
  onClose,
  release: initial,
}: {
  open: boolean;
  onClose: () => void;
  release?: AndroidRelease | null;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [release, setRelease] = useState<AndroidRelease | null | undefined>(
    initial,
  );
  const [loading, setLoading] = useState(!initial);
  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "/api/public/mobile-releases/android?channel=stable",
      );
      setRelease(
        response.ok ? ((await response.json()) as AndroidRelease) : null,
      );
    } catch {
      setRelease(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      ref.current?.showModal();
      if (!initial) {
        fetch("/api/public/mobile-releases/android?channel=stable")
          .then(async (response) =>
            response.ok ? ((await response.json()) as AndroidRelease) : null,
          )
          .catch(() => null)
          .then((latest) => {
            setRelease(latest);
            setLoading(false);
          });
      }
    } else ref.current?.close();
  }, [open, initial]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-t-3xl border border-[var(--border)] bg-white p-0 text-[var(--text)] shadow-[var(--shadow-md)] backdrop:bg-[rgb(13_53_32_/_56%)] sm:rounded-3xl"
    >
      <div className="max-h-[88dvh] overflow-y-auto p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-[.14em] text-[var(--field)] uppercase">
              Official Android download
            </p>
            <h2 className="mt-1 text-2xl font-black">
              Install AgriBridge on Android
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close download guide"
            onClick={onClose}
          >
            <X aria-hidden />
          </Button>
        </div>
        {loading ? (
          <p className="mt-6 text-sm" role="status">
            Checking the latest official release…
          </p>
        ) : release ? (
          <>
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              This signed Android app opens the AgriBridge website. Product
              workflows in this release are simulated.
            </p>
            <AndroidReleaseDetails release={release} />
            <div className="mt-5 rounded-xl border border-[var(--harvest)]/45 bg-amber-50 p-4 text-sm">
              <AlertTriangle
                className="mb-2 text-[var(--warning)]"
                aria-hidden
              />
              <strong>
                Install only the official AgriBridge APK downloaded from this
                page.
              </strong>
              <p className="mt-1">
                Android requires you to choose whether to allow installation
                from your browser. AgriBridge cannot enable this setting for
                you.
              </p>
            </div>
            <AndroidInstallSteps />
            <a
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--forest)] px-4 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--forest)]"
              href={release.downloadUrl}
            >
              <Download aria-hidden size={18} />
              Download APK
            </a>
            <details className="mt-5 rounded-xl border border-[var(--border)] p-4 text-sm">
              <summary className="cursor-pointer font-bold">Need help?</summary>
              <p className="mt-3 text-[var(--text-muted)]">
                After the download finishes, open Chrome Downloads. If Android
                blocks installation, tap Settings, allow this browser as the
                source, then return to the installer.
              </p>
            </details>
          </>
        ) : (
          <div className="mt-6 rounded-xl bg-[var(--surface-muted)] p-4 text-sm">
            <p>
              No Android APK is published yet. You can install the web app now,
              or return after an official Android release is available.
            </p>
            <Button
              className="mt-3"
              variant="secondary"
              onClick={() => void load()}
            >
              <RefreshCw aria-hidden size={17} />
              Retry
            </Button>
          </div>
        )}
      </div>
    </dialog>
  );
}
