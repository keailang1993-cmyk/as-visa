export const caseStatuses = [
  "submitted",
  "reviewing",
  "need_more_docs",
  "ready_to_submit",
  "submitted_embassy",
  "processing",
  "completed"
] as const;

export type CaseStatus = typeof caseStatuses[number];

export const statusLabels: Record<CaseStatus, string> = {
  completed: "办理完成",
  need_more_docs: "需要补充资料",
  processing: "使馆处理中",
  ready_to_submit: "准备递交",
  reviewing: "顾问审核中",
  submitted: "资料已提交",
  submitted_embassy: "已递交使馆"
};

export function isCaseStatus(value: string): value is CaseStatus {
  return caseStatuses.includes(value as CaseStatus);
}
