import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@as-visa/database";

export const runtime = "nodejs";

type SubmitPayload = {
  basicInfo: BasicInfoPayload;
  documents: DocumentPayload[];
};

type BasicInfoPayload = {
  birthDate?: string;
  destination?: string;
  name?: string;
  occupation?: string;
  passportNumber?: string;
  phone?: string;
  travelDate?: string;
};

type DocumentPayload = {
  documentName?: string;
  documentType?: string;
  fileMimeType?: string | null;
  fileName?: string;
  fileSize?: number | null;
};

const DOCUMENT_BUCKET = "as-visa-documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp"
]);

type ExistingCase = {
  case_code: string;
  id: string;
  status: string;
};

function createCaseCode() {
  const date = new Date();
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ASV-${datePart}-${randomPart}`;
}

function emptyToNull(value: string | undefined) {
  return value ? value : null;
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

function isFile(value: FormDataEntryValue): value is File {
  return typeof value !== "string" && typeof value.arrayBuffer === "function";
}

function validateFile(file: File) {
  if (!file || file.size === 0) {
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

function parseSubmitFormData(formData: FormData): SubmitPayload & { files: File[] } {
  const basicInfoValue = formData.get("basicInfo");

  if (typeof basicInfoValue !== "string") {
    throw new Error("Missing basicInfo");
  }

  const documents = formData.getAll("documents").map((value) => {
    if (typeof value !== "string") {
      throw new Error("Invalid document metadata");
    }

    return JSON.parse(value) as DocumentPayload;
  });
  const files = formData.getAll("files");

  if (documents.length !== files.length) {
    throw new Error("Document metadata and files length mismatch");
  }

  return {
    basicInfo: JSON.parse(basicInfoValue) as BasicInfoPayload,
    documents,
    files: files.map((file) => {
      if (!isFile(file)) {
        throw new Error("Invalid file payload");
      }

      return file;
    })
  };
}

function isValidPayload(payload: SubmitPayload & { files: File[] }) {
  const basicInfo = payload.basicInfo;

  return Boolean(
    basicInfo?.name &&
    basicInfo.phone &&
    basicInfo.passportNumber &&
    basicInfo.destination &&
    basicInfo.occupation &&
    payload.documents.length > 0 &&
    payload.documents.every((document) => document.documentName && document.documentType && document.fileName) &&
    payload.files.length === payload.documents.length &&
    payload.files.every((file) => validateFile(file) === null)
  );
}

async function deleteVisaCase(caseId: string, supabase: ReturnType<typeof createServerSupabaseClient>) {
  if (!supabase) return;
  const { error } = await supabase.from("visa_cases").delete().eq("id", caseId);

  if (error) {
    console.error("[AS VISA] Failed to roll back intake visa case.", error);
  }
}

async function removeUploadedFiles(filePaths: string[], supabase: ReturnType<typeof createServerSupabaseClient>) {
  if (!supabase || filePaths.length === 0) return;

  const { error } = await supabase.storage.from(DOCUMENT_BUCKET).remove(filePaths);

  if (error) {
    console.error("[AS VISA] Failed to roll back uploaded storage files.", error);
  }
}

export async function POST(request: Request) {
  let payload: SubmitPayload & { files: File[] };

  try {
    payload = parseSubmitFormData(await request.formData());
  } catch (error) {
    console.error("[AS VISA] Invalid intake multipart payload.", error);
    return NextResponse.json({ error: "Invalid multipart request body" }, { status: 400 });
  }

  if (!isValidPayload(payload)) {
    return NextResponse.json({ error: "Missing required intake fields or invalid files" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase server configuration is missing" }, { status: 503 });
  }

  const basicInfo = payload.basicInfo;
  const documents = payload.documents;
  const caseCode = createCaseCode();

  const { data: existingCases, error: existingCaseError } = await supabase
    .from("visa_cases")
    .select("id, case_code, status")
    .eq("applicant_phone", basicInfo.phone)
    .order("created_at", { ascending: false })
    .limit(1);
  const existingCase = existingCases?.[0] as ExistingCase | undefined;

  if (existingCaseError) {
    console.error("[AS VISA] Failed to check existing visa case.", existingCaseError);
    return NextResponse.json({ error: "Failed to check existing visa case" }, { status: 500 });
  }

  if (existingCase) {
    return NextResponse.json({
      caseCode: existingCase.case_code,
      caseId: existingCase.id,
      mode: "resume",
      status: existingCase.status
    });
  }

  const { data: visaCase, error: caseError } = await supabase
    .from("visa_cases")
    .insert({
      applicant_birth_date: emptyToNull(basicInfo.birthDate),
      applicant_name: basicInfo.name,
      applicant_phone: basicInfo.phone,
      case_code: caseCode,
      destination_country: basicInfo.destination,
      occupation_type: basicInfo.occupation,
      passport_number: basicInfo.passportNumber,
      source: "wechat_intake",
      status: "submitted",
      travel_date: emptyToNull(basicInfo.travelDate),
      visa_type: "日本旅游签证"
    })
    .select("id, case_code")
    .single();

  if (caseError || !visaCase) {
    console.error("[AS VISA] Failed to create intake visa case.", caseError);
    return NextResponse.json({ error: "Failed to create visa case" }, { status: 500 });
  }

  const caseId = visaCase.id as string;
  const insertedCaseCode = visaCase.case_code as string;
  const uploadedStoragePaths: string[] = [];

  const documentRows = [];

  for (let index = 0; index < documents.length; index += 1) {
    const document = documents[index];
    const file = payload.files[index];
    const fileName = document.fileName || file.name;
    const storagePath = createStoragePath(caseId, document.documentType!, fileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage.from(DOCUMENT_BUCKET).upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false
    });

    if (uploadError) {
      console.error("[AS VISA] Failed to upload intake document file.", uploadError);
      await removeUploadedFiles(uploadedStoragePaths, supabase);
      await deleteVisaCase(caseId, supabase);
      return NextResponse.json({ error: "Failed to upload document file" }, { status: 500 });
    }

    uploadedStoragePaths.push(storagePath);
    documentRows.push({
      case_id: caseId,
      document_name: document.documentName,
      document_type: document.documentType,
      file_mime_type: file.type || document.fileMimeType || null,
      file_name: fileName,
      file_path: storagePath,
      file_size: file.size || document.fileSize || null,
      status: "uploaded"
    });
  }

  const { error: documentsError } = await supabase.from("visa_documents").insert(documentRows);

  if (documentsError) {
    console.error("[AS VISA] Failed to create intake document metadata.", documentsError);
    await removeUploadedFiles(uploadedStoragePaths, supabase);
    await deleteVisaCase(caseId, supabase);
    return NextResponse.json({ error: "Failed to create document metadata" }, { status: 500 });
  }

  const { error: eventError } = await supabase.from("case_events").insert({
    case_id: caseId,
    description: "客户已通过微信资料填写链接提交资料。",
    event_type: "intake_submitted",
    title: "资料已提交"
  });

  if (eventError) {
    console.error("[AS VISA] Failed to create intake case event.", eventError);
    await removeUploadedFiles(uploadedStoragePaths, supabase);
    await deleteVisaCase(caseId, supabase);
    return NextResponse.json({ error: "Failed to create case event" }, { status: 500 });
  }

  return NextResponse.json({
    caseCode: insertedCaseCode,
    caseId,
    mode: "supabase"
  });
}
