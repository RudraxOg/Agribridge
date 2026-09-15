import "server-only";
import { redirect } from "next/navigation";
import { getAccessContext } from "@/lib/authorization/access";

export async function requireUser(locale: string) {
  const access = await getAccessContext();
  if (!access) redirect(`/${locale}/sign-in`);
  return access;
}
