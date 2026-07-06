import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@as-visa/database";

export const runtime = "nodejs";

const allowedDocuments = new Set(["passport", "idCard", "bankStatement", "photo", "other"]);

type SupplementRequestRouteProps = {
  params: Promise<{
    caseId: string;
  }>;
};

type SupplementRequestPayload = {
  message?: string;
  requestedDocuments?: string[];
};

export async function POST(request: Request, { params }: SupplementRequestRouteProps) {
  const { caseId } = await params;
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase server configuration is missing" }, { status: 503 });
  }

  let payload: SupplementRequestPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const message = payload.message?.trim();
  const requestedDocuments = (payload.requestedDocuments ?? []).filter((item) => allowedDocuments.has(item));

  if (!caseId) {
    return NextResponse.json({ error: "caseId is required" }, { status: 400 });
  }

  if (!message || requestedDocuments.length === 0) {
    return NextResponse.json({ error: "message and requestedDocuments are required" }, { status: 400 });
  }

  const { data: supplementRequest, error: requestError } = await supabase
    .from("supplement_requests")
    .insert({
      case_id: caseId,
      message,
      requested_documents: requestedDocuments,
      status: "active"
    })
    .select("id")
    .single();

  if (requestError || !supplementRequest) {
    console.error("[AS VISA] Failed to create supplement request.", requestError);
    return NextResponse.json({ error: "Failed to create supplement request" }, { status: 500 });
  }

  const { error: updateError } = await supabase
    .from("visa_cases")
    .update({ status: "need_more_docs" })
    .eq("id", caseId);

  if (updateError) {
    console.error("[AS VISA] Failed to update case status for supplement request.", updateError);
    return NextResponse.json({ error: "Failed to update case status" }, { status: 500 });
  }

  const { error: eventError } = await supabase.from("case_events").insert({
    case_id: caseId,
    description: message,
    event_type: "supplement_requested",
    title: "Supplement requested"
  });

  if (eventError) {
    console.error("[AS VISA] Failed to create supplement requested event.", eventError);
    return NextResponse.json({ error: "Failed to create case event" }, { status: 500 });
  }

  return NextResponse.json({
    requestId: supplementRequest.id,
    success: true
  });
}
