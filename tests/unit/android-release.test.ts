import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/download/android/route";
import { getLatestAndroidRelease } from "@/lib/mobile-releases/get-latest-android-release";
import {
  publishedAndroidApkUrl,
  publishedAndroidRelease,
} from "@/lib/mobile-releases/published-android-release";

afterEach(() => vi.unstubAllEnvs());

describe("published Android release in the simulated workspace", () => {
  it("exposes the real signed release regardless of mock integration mode", async () => {
    vi.stubEnv("INTEGRATION_MODE", "mock");
    expect(await getLatestAndroidRelease()).toEqual({
      release: publishedAndroidRelease,
      unavailable: false,
    });
  });

  it("redirects the download route to the pinned public APK", async () => {
    vi.stubEnv("INTEGRATION_MODE", "mock");
    const response = await GET(new Request("https://agribridge-phi.vercel.app/api/download/android"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(publishedAndroidApkUrl);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
