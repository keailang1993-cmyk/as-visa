import { createBrowserSupabaseClient } from "@as-visa/database";

export type IntakeBasicInfoInput = {
  name: string;
  phone: string;
  birthDate: string;
  passportNumber: string;
  destination: string;
  travelDate: string;
  occupation: string;
};

export type IntakeDocumentInput = {
  documentName: string;
  documentType: string;
  fileMimeType?: string | null;
  fileName: string;
  fileSize?: number | null;
};

export type IntakeCaseEventInput = {
  description?: string | null;
  eventType: string;
  title: string;
};

type VisaCaseInsertResult = {
  caseCode: string;
  caseId: string;
  mode: "mock" | "supabase";
};

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

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

function emptyToNull(value: string) {
  return value ? value : null;
}

export async function createVisaCase(input: IntakeBasicInfoInput): Promise<VisaCaseInsertResult> {
  const caseCode = createCaseCode();

  if (!isSupabaseConfigured()) {
    console.warn("[AS VISA] Supabase is not configured. Falling back to mock local intake submit.");
    return {
      caseCode,
      caseId: `mock-${caseCode}`,
      mode: "mock"
    };
  }

  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    console.warn("[AS VISA] Supabase client could not be created. Falling back to mock local intake submit.");
    return {
      caseCode,
      caseId: `mock-${caseCode}`,
      mode: "mock"
    };
  }

  const { data, error } = await supabase
    .from("visa_cases")
    .insert({
      applicant_birth_date: emptyToNull(input.birthDate),
      applicant_name: input.name,
      applicant_phone: input.phone,
      case_code: caseCode,
      destination_country: input.destination,
      occupation_type: input.occupation,
      passport_number: input.passportNumber,
      source: "wechat_intake",
      status: "submitted",
      travel_date: emptyToNull(input.travelDate),
      visa_type: "日本旅游签证"
    })
    .select("id, case_code")
    .single();

  if (error || !data) {
    console.warn("[AS VISA] Failed to create Supabase visa case. Falling back to mock local intake submit.", error);
    return {
      caseCode,
      caseId: `mock-${caseCode}`,
      mode: "mock"
    };
  }

  return {
    caseCode: data.case_code as string,
    caseId: data.id as string,
    mode: "supabase"
  };
}

export async function uploadVisaDocument(caseId: string, document: IntakeDocumentInput) {
  if (!isSupabaseConfigured() || caseId.startsWith("mock-")) {
    return { mode: "mock" as const };
  }

  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    return { mode: "mock" as const };
  }

  const { error } = await supabase.from("visa_documents").insert({
    case_id: caseId,
    document_name: document.documentName,
    document_type: document.documentType,
    file_mime_type: document.fileMimeType ?? null,
    file_name: document.fileName,
    file_path: "",
    file_size: document.fileSize ?? null,
    status: "uploaded"
  });

  if (error) {
    console.warn("[AS VISA] Failed to save Supabase document metadata.", error);
  }

  return { mode: error ? "mock" as const : "supabase" as const };
}

export async function createCaseEvent(caseId: string, event: IntakeCaseEventInput) {
  if (!isSupabaseConfigured() || caseId.startsWith("mock-")) {
    return { mode: "mock" as const };
  }

  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    return { mode: "mock" as const };
  }

  const { error } = await supabase.from("case_events").insert({
    case_id: caseId,
    description: event.description ?? null,
    event_type: event.eventType,
    title: event.title
  });

  if (error) {
    console.warn("[AS VISA] Failed to save Supabase case event.", error);
  }

  return { mode: error ? "mock" as const : "supabase" as const };
}
