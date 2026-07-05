import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@as-visa/database";

type SubmitPayload = {
  basicInfo?: {
    birthDate?: string;
    destination?: string;
    name?: string;
    occupation?: string;
    passportNumber?: string;
    phone?: string;
    travelDate?: string;
  };
  documents?: Array<{
    documentName?: string;
    documentType?: string;
    fileMimeType?: string | null;
    fileName?: string;
    fileSize?: number | null;
  }>;
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

function isValidPayload(payload: SubmitPayload) {
  const basicInfo = payload.basicInfo;

  return Boolean(
    basicInfo?.name &&
    basicInfo.phone &&
    basicInfo.passportNumber &&
    basicInfo.destination &&
    basicInfo.occupation &&
    Array.isArray(payload.documents) &&
    payload.documents.length > 0 &&
    payload.documents.every((document) => document.documentName && document.documentType && document.fileName)
  );
}

async function deleteVisaCase(caseId: string) {
  const supabase = createServerSupabaseClient();

  if (!supabase) return;

  const { error } = await supabase.from("visa_cases").delete().eq("id", caseId);

  if (error) {
    console.error("[AS VISA] Failed to roll back intake visa case.", error);
  }
}

export async function POST(request: Request) {
  let payload: SubmitPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isValidPayload(payload)) {
    return NextResponse.json({ error: "Missing required intake fields" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase server configuration is missing" }, { status: 503 });
  }

  const basicInfo = payload.basicInfo!;
  const documents = payload.documents!;
  const caseCode = createCaseCode();

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

  const documentRows = documents.map((document) => ({
    case_id: caseId,
    document_name: document.documentName,
    document_type: document.documentType,
    file_mime_type: document.fileMimeType ?? null,
    file_name: document.fileName,
    file_path: "",
    file_size: document.fileSize ?? null,
    status: "uploaded"
  }));

  const { error: documentsError } = await supabase.from("visa_documents").insert(documentRows);

  if (documentsError) {
    console.error("[AS VISA] Failed to create intake document metadata.", documentsError);
    await deleteVisaCase(caseId);
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
    await deleteVisaCase(caseId);
    return NextResponse.json({ error: "Failed to create case event" }, { status: 500 });
  }

  return NextResponse.json({
    caseCode: insertedCaseCode,
    caseId,
    mode: "supabase"
  });
}
