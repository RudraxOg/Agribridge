import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAPACITOR_SERVER_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://10.0.2.2:3000";
const config: CapacitorConfig = {
  appId: "com.agribridge.app",
  appName: "AgriBridge",
  // The authenticated Next.js app is server-rendered; this empty directory only satisfies
  // Capacitor's local fallback while the native WebView loads the configured HTTPS origin.
  webDir: "capacitor-web",
  server: { url: serverUrl, cleartext: serverUrl.startsWith("http://") },
  android: { allowMixedContent: false, captureInput: true },
};
export default config;
