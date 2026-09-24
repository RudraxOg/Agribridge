import { NextResponse } from "next/server";
import { z } from "zod";
import { getDemoAccessContext, guidedDemoCookie } from "@/features/guided-demo/lib/get-demo-access-context";
import { ensureDemoScenario } from "@/features/guided-demo/lib/demo-seed-resolver";
import { safeTourMetadata } from "@/features/guided-demo/lib/tour-events";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.generated";

const bodySchema = z.object({ action: z.enum(["start", "update", "skip", "complete", "exit", "restart"]), tourKey: z.string().max(80).optional(), stepKey: z.string().max(120).optional(), mode: z.enum(["interactive", "preview"]).optional() });
const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 };

function statusFor(action: z.infer<typeof bodySchema>["action"]) {
  if (action === "skip") return "skipped";
  if (action === "complete") return "completed";
  if (action === "exit") return "not_started";
  return "in_progress";
}

export async function GET() {
  const state = await getDemoAccessContext();
  return state ? NextResponse.json(state, { headers: { "Cache-Control": "no-store" } }) : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  const input = bodySchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Invalid guided-demo request" }, { status: 400 });
  const state = await getDemoAccessContext();
  if (!state) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { action, tourKey, stepKey, mode = "interactive" } = input.data;
  const status = statusFor(action);
  const nextTourKey = tourKey ?? state.currentTourKey ?? null;
  const nextStepKey = stepKey ?? state.currentStepKey ?? null;

  // Live organizations never receive synthetic records implicitly. They can only
  // run the safe preview until an explicit separate demo workspace is selected.
  if (!state.isDemo && (action === "start" || action === "restart") && mode !== "preview") return NextResponse.json({ error: "Open a separate demo workspace for interactive records" }, { status: 409 });
  if (state.isDemo && (action === "start" || action === "restart")) await ensureDemoScenario(state.organization?.slug);
  if (state.isDemo) {
    const response = NextResponse.json({ ok: true, status, tourKey: nextTourKey, stepKey: nextStepKey, simulated: true });
    response.cookies.set(guidedDemoCookie, JSON.stringify({ guided_demo_status: status, current_tour_key: nextTourKey, current_step_key: nextStepKey }), cookieOptions);
    return response;
  }

  const supabase = await createClient();
  const organizationId = state.organization?.id ?? null;
  const timestamp = new Date().toISOString();
  const userId = state.profile ? (await supabase.auth.getUser()).data.user?.id : null;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const progress = {
    user_id: userId,
    organization_id: organizationId,
    guided_demo_status: status,
    current_tour_key: nextTourKey,
    current_step_key: nextStepKey,
    last_seen_at: timestamp,
    selected_experience: action === "skip" ? "skip" : action === "start" || action === "restart" ? "guided_demo" : undefined,
    completed_at: action === "complete" ? timestamp : null,
    skipped_at: action === "skip" ? timestamp : null,
  };
  const { error: progressError } = await supabase.from("onboarding_progress").upsert(progress, { onConflict: "user_id,organization_id" });
  if (progressError) return NextResponse.json({ error: "Progress could not be saved" }, { status: 503 });

  if (action === "start" || action === "restart") {
    const { data: run } = await supabase.from("guided_demo_runs").insert({ user_id: progress.user_id, organization_id: organizationId, tour_key: nextTourKey ?? "unknown", mode, status: "in_progress" }).select("id").single();
    if (run?.id) await supabase.from("guided_demo_events").insert({ run_id: run.id, step_key: nextStepKey ?? "start", event_type: action === "restart" ? "started" : "started", metadata: safeTourMetadata({ mode }) as Json });
  }
  return NextResponse.json({ ok: true, status, tourKey: nextTourKey, stepKey: nextStepKey });
}
