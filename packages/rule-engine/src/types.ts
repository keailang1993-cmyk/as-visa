export type CountryCode = "CN" | "US" | "JP" | "KR";

export type VisaType = "tourism" | "business" | "student" | "family-visit";

export type ApplicantType = "individual" | "family" | "minor" | "business-owner";

export type RequirementLevel = "required" | "optional";

export type HumanReviewSeverity = "info" | "warning" | "blocker";

export interface RuleCountry {
  code: CountryCode;
  name: string;
}

export interface RuleDocument {
  id: string;
  title: string;
  documentName: string;
  requirement: RequirementLevel;
  uploadTitle: string;
  uploadDescription: string;
  guide: string;
  detectedLabel: string;
  successTitle: string;
  acceptedFileTypes: string[];
  allowCamera: boolean;
  allowPhotoLibrary: boolean;
}

export interface HumanReviewRule {
  id: string;
  title: string;
  description: string;
  severity: HumanReviewSeverity;
  appliesWhen: string[];
}

export interface VisaRuleSet {
  id: string;
  country: RuleCountry;
  visaType: VisaType;
  applicantType: ApplicantType;
  requiredDocuments: RuleDocument[];
  optionalDocuments: RuleDocument[];
  humanReviewRules: HumanReviewRule[];
}

export interface RuleEngineInput {
  countryCode?: CountryCode;
  visaType?: VisaType;
  applicantType?: ApplicantType;
}

export interface MissionItem {
  title: string;
  documentName: string;
  uploadTitle: string;
  uploadDescription: string;
  guide: string;
  detectedLabel: string;
  successTitle: string;
  sourceDocumentId: string;
  requirement: RequirementLevel;
}

export interface GeneratedUploadStep {
  route: "/upload";
  documentId: string;
  title: string;
  documentName: string;
  allowCamera: boolean;
  allowPhotoLibrary: boolean;
  acceptedFileTypes: string[];
}

export interface CompletionCondition {
  completeWhen: "all-required-documents-reviewed";
  requiredDocumentIds: string[];
  humanReviewRequired: boolean;
  humanReviewRuleIds: string[];
}

export interface GeneratedMissionFlow {
  ruleSetId: string;
  country: RuleCountry;
  visaType: VisaType;
  applicantType: ApplicantType;
  missions: MissionItem[];
  uploadFlow: GeneratedUploadStep[];
  completionCondition: CompletionCondition;
  humanReviewRules: HumanReviewRule[];
}
