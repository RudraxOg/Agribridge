import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ServiceWorkerRegistration } from "@/components/shared/service-worker-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AgriBridge", template: "%s · AgriBridge" },
  description: "Trusted bulk trade between FPOs and verified buyers.",
  applicationName: "AgriBridge",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "AgriBridge", statusBarStyle: "default" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#174A2E" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <Toaster position="top-center" richColors />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
