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
  mode: "mock" | "supabase";
};

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
    const response = await fetch("/api/intake/submit", {
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json"
      },
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
