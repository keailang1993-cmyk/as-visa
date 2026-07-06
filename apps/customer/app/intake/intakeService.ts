export type IntakeBasicInfoInput = {
  birthDate: string;
  destination: string;
  name: string;
  occupation: string;
  passportNumber: string;
  phone: string;
  travelDate: string;
};

export type IntakeDocumentInput = {
  documentName: string;
  documentType: string;
  file: File;
  fileMimeType?: string | null;
  fileName: string;
  fileSize?: number | null;
};

export type IntakeSubmitInput = {
  basicInfo: IntakeBasicInfoInput;
  documents: IntakeDocumentInput[];
};

export type IntakeSubmitResult = {
  caseCode: string;
  caseId: string;
  mode: "mock" | "resume" | "supabase";
  status?: string;
};

export type SupplementRequestDocument = {
  id: string;
  name: string;
  requirement: string;
};

export type ActiveSupplementRequest = {
  caseCode: string;
  caseId: string;
  message: string;
  requestedDocuments: SupplementRequestDocument[];
  requestId: string;
};

export type ResumeSupplementRequest = {
  message: string;
  requestedDocuments: SupplementRequestDocument[];
  requestId: string;
};

export type ResumeCaseResult = {
  caseCode?: string;
  caseId?: string;
  destinationCountry?: string;
  exists: boolean;
  status?: string;
  supplementRequests?: ResumeSupplementRequest[];
  visaType?: string;
};

export type SupplementSubmitInput = {
  documents: IntakeDocumentInput[];
  requestId: string;
};

type ApiErrorPayload = {
  detail?: unknown;
  error?: string;
  step?: string;
};

async function readApiError(response: Response, fallbackMessage: string) {
  try {
    const payload = await response.json() as ApiErrorPayload;
    const detail = typeof payload.detail === "string" ? payload.detail : "";
    const step = payload.step ? ` [${payload.step}]` : "";
    return `${payload.error || fallbackMessage}${step}${detail ? `: ${detail}` : ""}`;
  } catch {
    return fallbackMessage;
  }
}

function createMockCaseCode() {
  const date = new Date();
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MOCK-${datePart}-${randomPart}`;
}

function createDevelopmentMockSubmit(): IntakeSubmitResult {
  const caseCode = createMockCaseCode();
  return {
    caseCode,
    caseId: `mock-${caseCode}`,
    mode: "mock"
  };
}

export async function submitIntake(input: IntakeSubmitInput): Promise<IntakeSubmitResult> {
  try {
    const formData = new FormData();
    formData.append("basicInfo", JSON.stringify(input.basicInfo));

    input.documents.forEach((document) => {
      formData.append("documents", JSON.stringify({
        documentName: document.documentName,
        documentType: document.documentType,
        fileMimeType: document.fileMimeType ?? null,
        fileName: document.fileName,
        fileSize: document.fileSize ?? null
      }));
      formData.append("files", document.file, document.fileName);
    });

    const response = await fetch("/api/intake/submit", {
      body: formData,
      method: "POST"
    });

    if (!response.ok) {
      throw new Error(`Intake submit failed with status ${response.status}`);
    }

    return await response.json() as IntakeSubmitResult;
  } catch (error) {
    console.warn("[AS VISA] Intake API submit failed.", error);

    if (process.env.NODE_ENV !== "production") {
      console.warn("[AS VISA] Falling back to mock intake submit in development only.");
      return createDevelopmentMockSubmit();
    }

    throw error;
  }
}

export async function getActiveSupplementRequest(params: {
  caseCode?: string | null;
  caseId?: string | null;
}): Promise<ActiveSupplementRequest | null> {
  const searchParams = new URLSearchParams();

  if (params.caseId) {
    searchParams.set("caseId", params.caseId);
  }

  if (params.caseCode) {
    searchParams.set("caseCode", params.caseCode);
  }

  if (!searchParams.toString()) return null;

  const response = await fetch(`/api/intake/supplement?${searchParams.toString()}`, {
    method: "GET"
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(`Supplement lookup failed with status ${response.status}`);
  }

  return await response.json() as ActiveSupplementRequest;
}

export async function getResumeCase(phone: string): Promise<ResumeCaseResult> {
  const trimmedPhone = phone.trim();

  if (!trimmedPhone) {
    return { exists: false };
  }

  const searchParams = new URLSearchParams({ phone: trimmedPhone });
  const response = await fetch(`/api/intake/resume?${searchParams.toString()}`, {
    method: "GET"
  });

  if (!response.ok) {
    throw new Error(await readApiError(
      response,
      `Resume lookup failed with status ${response.status}`
    ));
  }

  return await response.json() as ResumeCaseResult;
}

export async function submitSupplement(input: SupplementSubmitInput) {
  const formData = new FormData();
  formData.append("requestId", input.requestId);

  input.documents.forEach((document) => {
    formData.append("documents", JSON.stringify({
      documentName: document.documentName,
      documentType: document.documentType,
      fileMimeType: document.fileMimeType ?? null,
      fileName: document.fileName,
      fileSize: document.fileSize ?? null
    }));
    formData.append("files", document.file, document.fileName);
  });

  const response = await fetch("/api/intake/supplement", {
    body: formData,
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(await readApiError(
      response,
      `Supplement submit failed with status ${response.status}`
    ));
  }

  return await response.json() as { caseId: string; mode: "supabase"; requestId: string };
}
