import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  experimental: {
    // This repository is on a mounted filesystem where Turbopack cache compaction
    // stalls navigation for 10–15s. Keep dev artifacts in memory for responsive HMR.
    turbopackFileSystemCacheForDev: false,
    // The TypeScript CLI emits valid config JSON directly, but Next's CLI wrapper
    // intermittently receives a truncated stream on this host during production builds.
    // Use Next's compiler-API checker instead; `npm run typecheck` remains enabled.
    useTypeScriptCli: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 78],
  },
  async headers() {
    const scriptSources = process.env.NODE_ENV === "development"
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'";
    const csp = [
      "default-src 'self'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", "object-src 'none'",
      scriptSources, "style-src 'self' 'unsafe-inline'", "font-src 'self' data:",
      "img-src 'self' data: blob: https:", "media-src 'self' blob: https:", "connect-src 'self' https: wss:", "worker-src 'self' blob:",
      "upgrade-insecure-requests",
    ].join("; ");
    return [{ source: "/(.*)", headers: [
      { key: "Content-Security-Policy", value: csp }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" }, { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(self), microphone=(self), geolocation=(self), payment=()" },
    ] }];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
