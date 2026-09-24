import { NextResponse } from "next/server";
import { z } from "zod";
const roleSchema = z.enum(["fpo", "buyer", "assisted", "logistics", "driver", "platform"]);
const formSchema = z.object({ role: roleSchema, locale: z.enum(["en", "hi", "mr", "pa", "bn", "gu", "te", "ta", "kn", "or"]) });

const rolePaths: Record<z.infer<typeof roleSchema>, string> = {
  fpo: "/fpo/awadh-pragati-fpc/dashboard",
  buyer: "/buyer/lucknow-fresh-mart/marketplace",
  assisted: "/fpo/farmers/new",
  logistics: "/logistics/gati-demo-logistics/dispatch",
  driver: "/logistics/gati-demo-logistics/my-trips",
  platform: "/platform/admin",
};

const cookieOptions = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 8 };

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.includes("application/json")) {
    const parsed = roleSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid demo role" }, { status: 400 });
    const response = NextResponse.json({ ok: true, role: parsed.data });
    response.cookies.set("agribridge_demo_role", parsed.data, cookieOptions);
    return response;
  }

  const parsed = formSchema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) return NextResponse.json({ error: "Invalid demo role or locale" }, { status: 400 });
  const response = NextResponse.redirect(new URL(`/${parsed.data.locale}${rolePaths[parsed.data.role]}`, request.url), 303);
  response.cookies.set("agribridge_demo_role", parsed.data.role, cookieOptions);
  return response;
}
