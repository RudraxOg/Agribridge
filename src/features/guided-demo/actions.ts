"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const rolePaths = {
  fpo: "/fpo/awadh-pragati-fpc/dashboard",
  buyer: "/buyer/lucknow-fresh-mart/marketplace",
  assisted: "/fpo/farmers/new",
  logistics: "/logistics/gati-demo-logistics/dispatch",
  driver: "/logistics/gati-demo-logistics/my-trips",
  platform: "/platform/admin",
} as const;

type DemoRole = keyof typeof rolePaths;

export async function startDemoSession(locale: string, role: DemoRole) {
  if (!/^(en|hi|mr|pa|bn|gu|te|ta|kn|or)$/.test(locale)) redirect("/en/demo-role");
  const store = await cookies();
  store.set("agribridge_demo_role", role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect(`/${locale}${rolePaths[role]}`);
}
