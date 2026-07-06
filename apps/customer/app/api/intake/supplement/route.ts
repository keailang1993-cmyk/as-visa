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

const FILE_EXTENSION_MIME_TYPES: Record<string, string> = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  pdf: "application/pdf",
  png: "image/png",
  webp: "image/webp"
};

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

type SupplementDocumentPayload = {
  documentName?: string;
  documentType?: string;
  fileMimeType?: string | null;
  fileName?: string;
  fileSize?: number | null;
};

function isFile(value: FormDataEntryValue): value is File {
  return typeof value !== "string" && typeof value.arrayBuffer === "function";
}

function safeFileName(fileName: string) {
  return fileName
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "document";
}

function createStoragePath(caseId: string, requestId: string, documentType: string, fileName: string) {
  return `cases/${caseId}/supplements/${requestId}/${documentType}/${Date.now()}-${safeFileName(fileName)}`;
}

function createApiError(step: string, message: string, status: number, detail?: unknown) {
  return NextResponse.json({
    detail,
    error: message,
    step
  }, { status });
}

function getErrorDetail(error: unknown) {
  if (!error) return null;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message);
  }
  return String(error);
}

function inferMimeType(file: File, fallbackFileName?: string | null, fallbackMimeType?: string | null) {
  if (file.type) return file.type;
  if (fallbackMimeType) return fallbackMimeType;

  const fileName = fallbackFileName || file.name;
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension ? FILE_EXTENSION_MIME_TYPES[extension] ?? "" : "";
}

function validateFile(file: File, fileName?: string | null, fileMimeType?: string | null) {
  if (file.size === 0) return "File is required";
  if (file.size > MAX_FILE_SIZE) return "File exceeds 10MB limit";
  if (!ALLOWED_FILE_TYPES.has(inferMimeType(file, fileName, fileMimeType))) {
    return "File type is not allowed";
  }
  return null;
}

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

async function removeUploadedFiles(filePaths: string[], supabase: ReturnType<typeof createServerSupabaseClient>) {
  if (!supabase || filePaths.length === 0) return;
  const { error } = await supabase.storage.from(DOCUMENT_BUCKET).remove(filePaths);

  if (error) {
    console.error("[AS VISA] Failed to roll back supplement files.", error);
  }
}

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase server configuration is missing" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get("caseId");
  const caseCode = searchParams.get("caseCode");

  if (!caseId && !caseCode) {
    return NextResponse.json({ error: "caseId or caseCode is required" }, { status: 400 });
  }

  let caseQuery = supabase.from("visa_cases").select("id, case_code").limit(1);
  caseQuery = caseId ? caseQuery.eq("id", caseId) : caseQuery.eq("case_code", caseCode);

  const { data: cases, error: caseError } = await caseQuery;
  const visaCase = cases?.[0];

  if (caseError || !visaCase) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const { data: supplementRequests, error: requestError } = await supabase
    .from("supplement_requests")
    .select("id, message, requested_documents")
    .eq("case_id", visaCase.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1);
  const supplementRequest = supplementRequests?.[0];

  if (requestError || !supplementRequest) {
    return NextResponse.json({ error: "Active supplement request not found" }, { status: 404 });
  }

  return NextResponse.json({
    caseCode: visaCase.case_code,
    caseId: visaCase.id,
    message: supplementRequest.message,
    requestedDocuments: normalizeRequestedDocuments(supplementRequest.requested_documents),
    requestId: supplementRequest.id
  });
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return createApiError("config", "Supabase server configuration is missing", 503);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch (error) {
    console.error("[AS VISA] Invalid supplement multipart payload.", error);
    return createApiError("parse_form_data", "Invalid multipart request body", 400, getErrorDetail(error));
  }

  const requestId = formData.get("requestId");
  const documentValues = formData.getAll("documents");
  const fileValues = formData.getAll("files");

  if (typeof requestId !== "string" || !requestId) {
    return createApiError("validate_request", "requestId is required", 400);
  }

  if (documentValues.length === 0 || documentValues.length !== fileValues.length) {
    return createApiError("validate_request", "Document metadata and files are required", 400, {
      documentCount: documentValues.length,
      fileCount: fileValues.length
    });
  }

  let documents: SupplementDocumentPayload[];
  let files: File[];

  try {
    documents = documentValues.map((value) => {
      if (typeof value !== "string") {
        throw new Error("Invalid document metadata");
      }
      return JSON.parse(value) as SupplementDocumentPayload;
    });
    files = fileValues.map((value) => {
      if (!isFile(value)) {
        throw new Error("Invalid file payload");
      }
      return value;
    });
  } catch (error) {
    console.error("[AS VISA] Failed to parse supplement document payload.", error);
    return createApiError("parse_documents", "Invalid document metadata or file payload", 400, getErrorDetail(error));
  }

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const document = documents[index];
    const validationError = validateFile(file, document.fileName, document.fileMimeType);

    if (validationError) {
      return createApiError("validate_files", validationError, 400, {
        fileName: document.fileName || file.name,
        fileMimeType: document.fileMimeType ?? null,
        inferredMimeType: inferMimeType(file, document.fileName, document.fileMimeType),
        receivedMimeType: file.type || null
      });
    }
  }

  const { data: supplementRequest, error: requestError } = await supabase
    .from("supplement_requests")
    .select("id, case_id, requested_documents")
    .eq("id", requestId)
    .eq("status", "active")
    .single();

  if (requestError || !supplementRequest) {
    return createApiError("load_supplement_request", "Active supplement request not found", 404, getErrorDetail(requestError));
  }

  const caseId = supplementRequest.case_id as string;
  const uploadedStoragePaths: string[] = [];
  const documentRows = [];

  for (let index = 0; index < documents.length; index += 1) {
    const document = documents[index];
    const file = files[index];
    const fileName = document.fileName || file.name;
    const documentType = document.documentType || "other";
    const fileMimeType = inferMimeType(file, fileName, document.fileMimeType);
    const storagePath = createStoragePath(caseId, requestId, documentType, fileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage.from(DOCUMENT_BUCKET).upload(storagePath, fileBuffer, {
      contentType: fileMimeType,
      upsert: false
    });

    if (uploadError) {
      console.error("[AS VISA] Failed to upload supplement file.", uploadError);
      await removeUploadedFiles(uploadedStoragePaths, supabase);
      return createApiError("storage_upload", "Failed to upload supplement file", 500, getErrorDetail(uploadError));
    }

    uploadedStoragePaths.push(storagePath);
    documentRows.push({
      case_id: caseId,
      document_name: document.documentName || documentCopy[documentType]?.name || "其他资料",
      document_type: documentType,
      file_mime_type: fileMimeType || null,
      file_name: fileName,
      file_path: storagePath,
      file_size: file.size || document.fileSize || null,
      status: "uploaded"
    });
  }

  const { error: documentsError } = await supabase.from("visa_documents").insert(documentRows);

  if (documentsError) {
    console.error("[AS VISA] Failed to create supplement document metadata.", documentsError);
    await removeUploadedFiles(uploadedStoragePaths, supabase);
    return createApiError("insert_visa_documents", "Failed to create supplement documents", 500, getErrorDetail(documentsError));
  }

  const { error: updateRequestError } = await supabase
    .from("supplement_requests")
    .update({
      completed_at: new Date().toISOString(),
      status: "completed"
    })
    .eq("id", requestId);

  if (updateRequestError) {
    console.error("[AS VISA] Failed to complete supplement request.", updateRequestError);
    return createApiError("complete_supplement_request", "Failed to complete supplement request", 500, getErrorDetail(updateRequestError));
  }

  const { data: remainingRequests, error: remainingRequestsError } = await supabase
    .from("supplement_requests")
    .select("id")
    .eq("case_id", caseId)
    .eq("status", "active")
    .limit(1);

  if (remainingRequestsError) {
    console.error("[AS VISA] Failed to check remaining supplement requests.", remainingRequestsError);
    return createApiError("check_remaining_supplements", "Failed to check remaining supplement requests", 500, getErrorDetail(remainingRequestsError));
  }

  if ((remainingRequests ?? []).length === 0) {
    const { error: caseUpdateError } = await supabase
      .from("visa_cases")
      .update({ status: "reviewing" })
      .eq("id", caseId);

    if (caseUpdateError) {
      console.error("[AS VISA] Failed to return case to review.", caseUpdateError);
      return createApiError("update_case_status", "Failed to update case status", 500, getErrorDetail(caseUpdateError));
    }
  }

  const { error: eventError } = await supabase.from("case_events").insert({
    case_id: caseId,
    description: "客户已通过补件链接上传所需资料。",
    event_type: "supplement_uploaded",
    title: "Supplement uploaded"
  });

  if (eventError) {
    console.error("[AS VISA] Failed to create supplement uploaded event.", eventError);
    return createApiError("insert_case_event", "Failed to create case event", 500, getErrorDetail(eventError));
  }

  return NextResponse.json({
    caseId,
    mode: "supabase",
    requestId
  });
}
