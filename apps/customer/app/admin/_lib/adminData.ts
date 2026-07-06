import { createServerSupabaseClient } from "@as-visa/database";
import { isCaseStatus, type CaseStatus } from "./status";

export type VisaCase = {
  applicant_birth_date: string | null;
  applicant_name: string;
  applicant_phone: string;
  case_code: string;
  created_at: string;
  destination_country: string;
  id: string;
  occupation_type: string;
  passport_number: string;
  status: CaseStatus | string;
  travel_date: string | null;
  visa_type: string;
};

export type VisaDocument = {
  created_at: string;
  document_name: string;
  document_type: string;
  file_mime_type: string | null;
  file_name: string;
  file_path: string;
  file_size: number | null;
  id: string;
  status: string;
};

export type CaseEvent = {
  created_at: string;
  description: string | null;
  event_type: string;
  id: string;
  staff_name?: string | null;
  title: string;
};

export type CaseNote = {
  case_id: string;
  content: string;
  created_at: string;
  id: string;
  staff_name: string;
  updated_at: string;
};

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "未填写";
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "未填写";
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium"
  }).format(new Date(value));
}

export function formatFileSize(value: number | null | undefined) {
  if (!value) return "未记录";
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export async function getAdminCases(status?: string) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return { cases: [], error: "Supabase server configuration is missing." };
  }

  let query = supabase
    .from("visa_cases")
    .select("id, case_code, applicant_name, applicant_phone, visa_type, destination_country, status, created_at, applicant_birth_date, passport_number, travel_date, occupation_type")
    .order("created_at", { ascending: false });

  if (status && status !== "all" && isCaseStatus(status)) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  return {
    cases: (data ?? []) as VisaCase[],
    error: error ? error.message : null
  };
}

export async function getAdminCaseDetail(caseId: string) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return {
      caseEvents: [],
      caseNotes: [],
      documents: [],
      error: "Supabase server configuration is missing.",
      visaCase: null
    };
  }

  const [caseResult, documentResult, eventResult, noteResult] = await Promise.all([
    supabase
      .from("visa_cases")
      .select("id, case_code, applicant_name, applicant_phone, applicant_birth_date, passport_number, travel_date, occupation_type, visa_type, destination_country, status, created_at")
      .eq("id", caseId)
      .single(),
    supabase
      .from("visa_documents")
      .select("id, document_name, document_type, file_name, file_path, file_mime_type, file_size, status, created_at")
      .eq("case_id", caseId)
      .order("created_at", { ascending: false }),
    supabase
      .from("case_events")
      .select("id, title, description, event_type, created_at")
      .eq("case_id", caseId)
      .order("created_at", { ascending: true }),
    supabase
      .from("case_notes")
      .select("id, case_id, staff_name, content, created_at, updated_at")
      .eq("case_id", caseId)
      .order("created_at", { ascending: false })
  ]);

  return {
    caseEvents: (eventResult.data ?? []) as CaseEvent[],
    caseNotes: (noteResult.data ?? []) as CaseNote[],
    documents: (documentResult.data ?? []) as VisaDocument[],
    error: caseResult.error?.message ?? documentResult.error?.message ?? eventResult.error?.message ?? noteResult.error?.message ?? null,
    visaCase: caseResult.data as VisaCase | null
  };
}
