import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@as-visa/database";
import { isCaseStatus, statusLabels, type CaseStatus } from "../../../../../admin/_lib/status";

export const runtime = "nodejs";

type StatusRouteProps = {
  params: Promise<{
    caseId: string;
  }>;
};

export async function POST(request: Request, { params }: StatusRouteProps) {
  const { caseId } = await params;
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase server configuration is missing" }, { status: 503 });
  }

  let payload: { status?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!caseId) {
    return NextResponse.json({ error: "caseId is required" }, { status: 400 });
  }

  if (!payload.status || !isCaseStatus(payload.status)) {
    return NextResponse.json({ error: "Invalid case status" }, { status: 400 });
  }

  const status = payload.status;
  const { error: updateError } = await supabase
    .from("visa_cases")
    .update({ status })
    .eq("id", caseId)
    .select("id")
    .single();

  if (updateError) {
    console.error("[AS VISA] Failed to update case status.", updateError);
    return NextResponse.json({ error: "Failed to update case status" }, { status: 500 });
  }

  const title = statusLabels[status as CaseStatus];
  const { error: eventError } = await supabase.from("case_events").insert({
    case_id: caseId,
    description: `员工将案件状态更新为：${title}`,
    event_type: status,
    title
  });

  if (eventError) {
    console.error("[AS VISA] Failed to create case status event.", eventError);
    return NextResponse.json({ error: "Failed to create case event" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
