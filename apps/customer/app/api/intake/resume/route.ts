import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@as-visa/database";

export const runtime = "nodejs";

const documentCopy: Record<string, { name: string; requirement: string }> = {
  bankStatement: {
    name: "银行流水",
    requirement: "请上传最新近 6 个月银行流水文件或截图。"
  },
  idCard: {
    name: "身份证",
    requirement: "请上传身份证正反面清晰照片。"
  },
  other: {
    name: "其他资料",
    requirement: "请按顾问说明上传补充资料。"
  },
  passport: {
    name: "护照首页",
    requirement: "请上传清晰照片，确保四角完整、无反光。"
  },
  photo: {
    name: "证件照",
    requirement: "请上传白底证件照。"
  }
};

function normalizeRequestedDocuments(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((id) => ({
      id,
      name: documentCopy[id]?.name ?? "其他资料",
      requirement: documentCopy[id]?.requirement ?? "请按顾问说明上传补充资料。"
    }));
}

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase server configuration is missing" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone")?.trim();

  if (!phone) {
    return NextResponse.json({ error: "phone is required" }, { status: 400 });
  }

  const { data: cases, error: caseError } = await supabase
    .from("visa_cases")
    .select("id, case_code, status, visa_type, destination_country")
    .eq("applicant_phone", phone)
    .order("created_at", { ascending: false })
    .limit(1);
  const visaCase = cases?.[0];

  if (caseError) {
    console.error("[AS VISA] Failed to resume case by phone.", caseError);
    return NextResponse.json({ error: "Failed to check existing case" }, { status: 500 });
  }

  if (!visaCase) {
    return NextResponse.json({ exists: false });
  }

  const { data: supplementRequests, error: supplementError } = await supabase
    .from("supplement_requests")
    .select("id, message, requested_documents")
    .eq("case_id", visaCase.id)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (supplementError) {
    console.error("[AS VISA] Failed to load active supplement requests.", supplementError);
    return NextResponse.json({ error: "Failed to load supplement requests" }, { status: 500 });
  }

  return NextResponse.json({
    caseCode: visaCase.case_code,
    caseId: visaCase.id,
    destinationCountry: visaCase.destination_country,
    exists: true,
    status: visaCase.status,
    supplementRequests: (supplementRequests ?? []).map((item) => ({
      message: item.message,
      requestedDocuments: normalizeRequestedDocuments(item.requested_documents),
      requestId: item.id
    })),
    visaType: visaCase.visa_type
  });
}
