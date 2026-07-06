import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@as-visa/database";

export const runtime = "nodejs";

type NotesRouteProps = {
  params: Promise<{
    caseId: string;
  }>;
};

type NotePayload = {
  content?: string;
  staffName?: string;
};

export async function GET(_request: Request, { params }: NotesRouteProps) {
  const { caseId } = await params;
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase server configuration is missing" }, { status: 503 });
  }

  if (!caseId) {
    return NextResponse.json({ error: "caseId is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("case_notes")
    .select("id, case_id, staff_name, content, created_at, updated_at")
    .eq("case_id", caseId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[AS VISA] Failed to load internal notes.", error);
    return NextResponse.json({ error: "Failed to load internal notes" }, { status: 500 });
  }

  return NextResponse.json({ notes: data ?? [] });
}

export async function POST(request: Request, { params }: NotesRouteProps) {
  const { caseId } = await params;
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase server configuration is missing" }, { status: 503 });
  }

  let payload: NotePayload;

  try {
    payload = await request.json() as NotePayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const content = payload.content?.trim();
  const staffName = payload.staffName?.trim() || "AS VISA Staff";

  if (!caseId) {
    return NextResponse.json({ error: "caseId is required" }, { status: 400 });
  }

  if (!content) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("case_notes")
    .insert({
      case_id: caseId,
      content,
      staff_name: staffName
    })
    .select("id, case_id, staff_name, content, created_at, updated_at")
    .single();

  if (error || !data) {
    console.error("[AS VISA] Failed to create internal note.", error);
    return NextResponse.json({ error: "Failed to create internal note" }, { status: 500 });
  }

  return NextResponse.json({ note: data });
}
