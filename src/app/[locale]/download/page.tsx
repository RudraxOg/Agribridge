import Link from "next/link";
import { Download, Globe2, Smartphone } from "lucide-react";
import { AndroidInstallSteps } from "@/components/downloads/android-install-steps";
import { AndroidReleaseDetails } from "@/components/downloads/android-release-details";
import { InstallPrompt } from "@/components/shared/install-prompt";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shell/page-header";
import { getLatestAndroidRelease } from "@/lib/mobile-releases/get-latest-android-release";
import { requireLocale } from "@/lib/i18n/locale";

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = requireLocale((await params).locale);
  const { release } = await getLatestAndroidRelease();

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <PageHeader
        eyebrow="Choose how to install"
        title="Install AgriBridge"
        description="Use the web app on a supported browser, or download the official Android APK when a release is available."
      />
      <div className="grid items-start gap-6 md:grid-cols-2">
        <Card id="web-app" className="scroll-mt-6 p-5 sm:p-7">
          <Globe2 aria-hidden className="text-[var(--field)]" size={30} />
          <h2 className="mt-3 text-2xl font-black">Install Web App</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Add AgriBridge to your home screen from your browser. On some
            Android browsers this is packaged as a WebAPK; it uses this website
            and needs no separate APK download.
          </p>
          <div className="mt-5">
            <InstallPrompt fallbackHref="#web-install-help" />
          </div>
          <div id="web-install-help" className="mt-5 border-t border-[var(--border)] pt-5 text-sm">
            <p className="font-bold">If no install prompt appears</p>
            <p className="mt-2 text-[var(--text-muted)]">
              Android Chrome: open the browser menu and choose Install app or
              Add to Home screen. On iPhone, open in Safari, tap Share, then
              Add to Home Screen. Desktop browsers may show Install in the
              address bar or browser menu.
            </p>
          </div>
        </Card>
        <Card className="p-5 sm:p-7">
          <Smartphone aria-hidden className="text-[var(--field)]" size={30} />
          <h2 className="mt-3 text-2xl font-black">Install Android APK</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Download and install the official Android release directly on an
            Android device.
          </p>
          {release ? (
            <>
              <AndroidReleaseDetails release={release} />
              <a
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--forest)] px-4 font-bold text-white hover:bg-[var(--forest-deep)]"
                href={release.downloadUrl}
              >
                <Download aria-hidden size={18} />
                Download Android APK
              </a>
              <AndroidInstallSteps />
            </>
          ) : (
            <p className="mt-5 rounded-xl bg-[var(--surface-muted)] p-4 text-sm" role="status">
              No official Android APK is published yet. Use the web app option
              for now.
            </p>
          )}
        </Card>
      </div>
      <Link
        className="mt-6 inline-flex min-h-12 items-center font-bold text-[var(--forest)]"
        href={`/${locale}`}
      >
        Return to AgriBridge
      </Link>
    </main>
  );
}
