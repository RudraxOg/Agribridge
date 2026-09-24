import type { AndroidRelease } from "./types";

// Public, immutable release metadata. Product integration mode does not affect
// whether this signed Android wrapper can be downloaded.
export const publishedAndroidApkUrl =
  "https://github.com/RudraxOg/Agribridge/releases/download/android-v1.0.0/app-release.apk";

export const publishedAndroidRelease: AndroidRelease = {
  id: "android-v1.0.0",
  version: "1.0",
  versionCode: 1,
  fileSizeBytes: 8_094_506,
  minAndroidSdk: 26,
  sha256: "66d3f8f53b5c5a0ae823819f9376f375be4ac335473453361136df166b747e62",
  releaseNotes: ["Signed Android app for the AgriBridge website; product workflows are simulated."],
  publishedAt: "2026-09-24T19:24:25Z",
  downloadUrl: "/api/download/android",
};
