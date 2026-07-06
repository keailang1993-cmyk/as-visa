import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@as-visa/database";

export const runtime = "nodejs";

type NoteRouteProps = {
  params: Promise<{
    caseId: string;
    noteId: string;
  }>;
};

type NotePayload = {
  content?: string;
  staffName?: string;
};

export async function PATCH(request: Request, { params }: NoteRouteProps) {
  const { caseId, noteId } = await params;
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

  if (!caseId || !noteId) {
    return NextResponse.json({ error: "caseId and noteId are required" }, { status: 400 });
  }

  if (!content) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("case_notes")
    .update({
      content,
      staff_name: staffName
    })
    .eq("id", noteId)
    .eq("case_id", caseId)
    .select("id, case_id, staff_name, content, created_at, updated_at")
    .single();

  if (error || !data) {
    console.error("[AS VISA] Failed to update internal note.", error);
    return NextResponse.json({ error: "Failed to update internal note" }, { status: 500 });
  }

  return NextResponse.json({ note: data });
}

export async function DELETE(_request: Request, { params }: NoteRouteProps) {
  const { caseId, noteId } = await params;
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase server configuration is missing" }, { status: 503 });
  }

  if (!caseId || !noteId) {
    return NextResponse.json({ error: "caseId and noteId are required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("case_notes")
    .delete()
    .eq("id", noteId)
    .eq("case_id", caseId);

  if (error) {
    console.error("[AS VISA] Failed to delete internal note.", error);
    return NextResponse.json({ error: "Failed to delete internal note" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
