import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@as-visa/database";

export const runtime = "nodejs";

const DOCUMENT_BUCKET = "as-visa-documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp"
]);

function isFile(value: FormDataEntryValue | null): value is File {
  return value !== null && typeof value !== "string" && typeof value.arrayBuffer === "function";
}

function safeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "document";
}

function createStoragePath(caseId: string, documentType: string, fileName: string) {
  return `cases/${caseId}/${documentType}/${Date.now()}-${safeFileName(fileName)}`;
}

function validateFile(file: File) {
  if (file.size === 0) {
    return "File is required";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File exceeds 10MB limit";
  }

  if (!ALLOWED_FILE_TYPES.has(file.type)) {
    return "File type is not allowed";
  }

  return null;
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase server configuration is missing" }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const caseId = formData.get("caseId");
  const documentType = formData.get("documentType");
  const documentName = formData.get("documentName");

  if (!isFile(file)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (typeof caseId !== "string" || !caseId) {
    return NextResponse.json({ error: "caseId is required" }, { status: 400 });
  }

  if (typeof documentType !== "string" || !documentType) {
    return NextResponse.json({ error: "documentType is required" }, { status: 400 });
  }

  if (typeof documentName !== "string" || !documentName) {
    return NextResponse.json({ error: "documentName is required" }, { status: 400 });
  }

  const fileValidationError = validateFile(file);

  if (fileValidationError) {
    return NextResponse.json({ error: fileValidationError }, { status: 400 });
  }

  const { data: visaCase, error: caseError } = await supabase
    .from("visa_cases")
    .select("id")
    .eq("id", caseId)
    .single();

  if (caseError || !visaCase) {
    return NextResponse.json({ error: "caseId does not exist" }, { status: 404 });
  }

  const filePath = createStoragePath(caseId, documentType, file.name);
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage.from(DOCUMENT_BUCKET).upload(filePath, fileBuffer, {
    contentType: file.type,
    upsert: false
  });

  if (uploadError) {
    console.error("[AS VISA] Failed to upload intake file.", uploadError);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }

  return NextResponse.json({
    fileMimeType: file.type || null,
    fileName: file.name,
    filePath,
    fileSize: file.size
  });
}
