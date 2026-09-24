import { NextResponse } from "next/server";
import { z } from "zod";
import { getLatestAndroidRelease } from "@/lib/mobile-releases/get-latest-android-release";
export const revalidate = 300;
const schema = z.object({ channel: z.literal("stable").default("stable") });
export async function GET(request: Request) {
  const parsed = schema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: "Only the stable Android release is public" },
      { status: 400 },
    );
  const state = await getLatestAndroidRelease();
  if (!state.release)
    return NextResponse.json(
      { error: "No Android release is available" },
      { status: 404, headers: { "Cache-Control": "public, max-age=60" } },
    );
  return NextResponse.json(state.release, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
