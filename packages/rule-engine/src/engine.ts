import { visaRuleSets } from "./rules";
import type {
  CompletionCondition,
  GeneratedMissionFlow,
  GeneratedUploadStep,
  MissionItem,
  RuleEngineInput,
  VisaRuleSet
} from "./types";

export const defaultRuleEngineInput = {
  countryCode: "CN",
  visaType: "tourism",
  applicantType: "individual"
} as const satisfies Required<RuleEngineInput>;

export function findRuleSet(input: RuleEngineInput = {}): VisaRuleSet {
  const countryCode = input.countryCode ?? defaultRuleEngineInput.countryCode;
  const visaType = input.visaType ?? defaultRuleEngineInput.visaType;
  const applicantType = input.applicantType ?? defaultRuleEngineInput.applicantType;

  const ruleSet = visaRuleSets.find(
    (candidate) =>
      candidate.country.code === countryCode &&
      candidate.visaType === visaType &&
      candidate.applicantType === applicantType
  );

  if (!ruleSet) {
    throw new Error(
      `No AS VISA rule set found for country=${countryCode}, visaType=${visaType}, applicantType=${applicantType}`
    );
  }

  return ruleSet;
}

export function generateMissionList(ruleSet: VisaRuleSet): MissionItem[] {
  return ruleSet.requiredDocuments.map((document) => ({
    title: document.title,
    documentName: document.documentName,
    uploadTitle: document.uploadTitle,
    uploadDescription: document.uploadDescription,
    guide: document.guide,
    detectedLabel: document.detectedLabel,
    successTitle: document.successTitle,
    sourceDocumentId: document.id,
    requirement: document.requirement
  }));
}

export function generateUploadFlow(ruleSet: VisaRuleSet): GeneratedUploadStep[] {
  return [...ruleSet.requiredDocuments, ...ruleSet.optionalDocuments].map((document) => ({
    route: "/upload",
    documentId: document.id,
    title: document.title,
    documentName: document.documentName,
    allowCamera: document.allowCamera,
    allowPhotoLibrary: document.allowPhotoLibrary,
    acceptedFileTypes: document.acceptedFileTypes
  }));
}

export function generateCompletionCondition(ruleSet: VisaRuleSet): CompletionCondition {
  return {
    completeWhen: "all-required-documents-reviewed",
    requiredDocumentIds: ruleSet.requiredDocuments.map((document) => document.id),
    humanReviewRequired: ruleSet.humanReviewRules.length > 0,
    humanReviewRuleIds: ruleSet.humanReviewRules.map((rule) => rule.id)
  };
}

export function generateMissionFlow(input: RuleEngineInput = {}): GeneratedMissionFlow {
  const ruleSet = findRuleSet(input);

  return {
    ruleSetId: ruleSet.id,
    country: ruleSet.country,
    visaType: ruleSet.visaType,
    applicantType: ruleSet.applicantType,
    missions: generateMissionList(ruleSet),
    uploadFlow: generateUploadFlow(ruleSet),
    completionCondition: generateCompletionCondition(ruleSet),
    humanReviewRules: ruleSet.humanReviewRules
  };
}

export const defaultGeneratedMissionFlow = generateMissionFlow(defaultRuleEngineInput);

export const defaultMissionFlow = defaultGeneratedMissionFlow.missions;
