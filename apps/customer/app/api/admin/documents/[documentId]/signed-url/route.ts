import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@as-visa/database";

export const runtime = "nodejs";

const DOCUMENT_BUCKET = "as-visa-documents";
const SIGNED_URL_EXPIRES_IN_SECONDS = 300;

type SignedUrlRouteProps = {
  params: Promise<{
    documentId: string;
  }>;
};

export async function GET(_request: Request, { params }: SignedUrlRouteProps) {
  const { documentId } = await params;
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase server configuration is missing" }, { status: 503 });
  }

  if (!documentId) {
    return NextResponse.json({ error: "documentId is required" }, { status: 400 });
  }

  const { data: document, error: documentError } = await supabase
    .from("visa_documents")
    .select("id, file_path")
    .eq("id", documentId)
    .single();

  if (documentError || !document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const filePath = typeof document.file_path === "string" ? document.file_path : "";

  if (!filePath) {
    return NextResponse.json({ error: "Document file_path is empty" }, { status: 400 });
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .createSignedUrl(filePath, SIGNED_URL_EXPIRES_IN_SECONDS);

  if (signedUrlError || !data?.signedUrl) {
    console.error("[AS VISA] Failed to create admin document signed URL.", signedUrlError);
    return NextResponse.json({ error: "Failed to create signed URL" }, { status: 500 });
  }

  return NextResponse.json({
    expiresIn: SIGNED_URL_EXPIRES_IN_SECONDS,
    signedUrl: data.signedUrl
  });
}
