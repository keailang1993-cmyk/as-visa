import type { HumanReviewRule, RuleDocument, VisaRuleSet } from "./types";

const defaultAcceptedFileTypes = ["image/jpeg", "image/png", "application/pdf"];

function createDocument(
  document: Omit<RuleDocument, "acceptedFileTypes" | "allowCamera" | "allowPhotoLibrary">
): RuleDocument {
  return {
    ...document,
    acceptedFileTypes: defaultAcceptedFileTypes,
    allowCamera: true,
    allowPhotoLibrary: true
  };
}

const passport = createDocument({
  id: "passport",
  title: "上传护照",
  documentName: "护照",
  requirement: "required",
  uploadTitle: "请上传护照",
  uploadDescription: "请确保照片清晰、四角完整、没有反光。",
  guide: "请将护照平放，确保整页信息完整清晰。",
  detectedLabel: "已识别护照",
  successTitle: "护照已收到，正在准备初步检查。"
});

const idCard = createDocument({
  id: "id-card",
  title: "上传身份证",
  documentName: "身份证",
  requirement: "required",
  uploadTitle: "请上传身份证",
  uploadDescription: "请确保身份证信息清晰、边缘完整、没有遮挡。",
  guide: "请将身份证放在平整表面，确保文字清楚可读。",
  detectedLabel: "已识别身份证",
  successTitle: "身份证已收到，正在准备初步检查。"
});

const bankStatement = createDocument({
  id: "bank-statement",
  title: "上传银行流水",
  documentName: "银行流水",
  requirement: "required",
  uploadTitle: "请上传银行流水",
  uploadDescription: "请上传清晰的银行流水照片或 PDF 文件。",
  guide: "请确保姓名、银行名称和近期交易记录清晰可见。",
  detectedLabel: "已识别银行流水",
  successTitle: "银行流水已收到，正在准备初步检查。"
});

const employmentLetter = createDocument({
  id: "employment-letter",
  title: "上传在职证明",
  documentName: "在职证明",
  requirement: "optional",
  uploadTitle: "请上传在职证明",
  uploadDescription: "如您已有在职证明，可上传用于顾问辅助判断。",
  guide: "请确保公司名称、职位和盖章信息清晰可见。",
  detectedLabel: "已识别在职证明",
  successTitle: "在职证明已收到，顾问将作为辅助资料查看。"
});

const travelPlan = createDocument({
  id: "travel-plan",
  title: "上传行程计划",
  documentName: "行程计划",
  requirement: "optional",
  uploadTitle: "请上传行程计划",
  uploadDescription: "如您已有行程安排，可上传用于提高资料完整度。",
  guide: "请确保出行日期、目的地和住宿信息清晰。",
  detectedLabel: "已识别行程计划",
  successTitle: "行程计划已收到，顾问将作为辅助资料查看。"
});

const defaultHumanReviewRules: HumanReviewRule[] = [
  {
    id: "passport-expiry-review",
    title: "护照有效期复核",
    description: "当护照剩余有效期不足常规要求时，需要顾问人工确认是否可继续办理。",
    severity: "warning",
    appliesWhen: ["passport.expiry_date_lt_6_months"]
  },
  {
    id: "bank-statement-quality-review",
    title: "银行流水清晰度复核",
    description: "当银行流水页数缺失、姓名不清晰或时间范围不足时，需要顾问人工复核。",
    severity: "info",
    appliesWhen: ["bank_statement.missing_pages", "bank_statement.low_confidence_ocr"]
  }
];

export const visaRuleSets: VisaRuleSet[] = [
  {
    id: "CN:tourism:individual",
    country: { code: "CN", name: "中国" },
    visaType: "tourism",
    applicantType: "individual",
    requiredDocuments: [passport, idCard, bankStatement],
    optionalDocuments: [employmentLetter, travelPlan],
    humanReviewRules: [...defaultHumanReviewRules]
  },
  {
    id: "US:tourism:individual",
    country: { code: "US", name: "美国" },
    visaType: "tourism",
    applicantType: "individual",
    requiredDocuments: [passport, idCard, bankStatement],
    optionalDocuments: [employmentLetter, travelPlan],
    humanReviewRules: [...defaultHumanReviewRules]
  },
  {
    id: "JP:tourism:individual",
    country: { code: "JP", name: "日本" },
    visaType: "tourism",
    applicantType: "individual",
    requiredDocuments: [passport, idCard, bankStatement],
    optionalDocuments: [employmentLetter, travelPlan],
    humanReviewRules: [...defaultHumanReviewRules]
  },
  {
    id: "KR:tourism:individual",
    country: { code: "KR", name: "韩国" },
    visaType: "tourism",
    applicantType: "individual",
    requiredDocuments: [passport, idCard, bankStatement],
    optionalDocuments: [employmentLetter, travelPlan],
    humanReviewRules: [...defaultHumanReviewRules]
  }
];
