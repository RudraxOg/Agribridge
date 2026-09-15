import { NextResponse } from "next/server";
import { z } from "zod";
const schema = z.object({ role: z.enum(["fpo", "buyer", "assisted", "logistics", "driver", "platform"]) });
export async function POST(request: Request) { const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid demo role" }, { status: 400 }); const response = NextResponse.json({ ok: true, role: parsed.data.role }); response.cookies.set("agribridge_demo_role", parsed.data.role, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 }); return response; }
