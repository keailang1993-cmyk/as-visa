"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { Button, Check, FileText, Upload } from "@as-visa/ui";
import {
  getActiveSupplementRequest,
  getResumeCase,
  submitIntake,
  submitSupplement,
  type ActiveSupplementRequest,
  type ResumeCaseEvent,
  type ResumeCaseResult,
  type ResumeSupplementRequest
} from "./intakeService";
import styles from "./intake.module.css";

type IntakeStep = 1 | 2 | 3 | 4 | 5;

type BasicInfo = {
  name: string;
  phone: string;
  birthDate: string;
  passportNumber: string;
  destination: string;
  travelDate: string;
  occupation: string;
};

type DocumentItem = {
  id: keyof UploadedDocuments;
  name: string;
  requirement: string;
};

type UploadedDocuments = {
  passport: UploadedDocument | null;
  idCard: UploadedDocument | null;
  bankStatement: UploadedDocument | null;
  photo: UploadedDocument | null;
};

type UploadedDocument = {
  file: File;
  fileName: string;
  fileMimeType: string | null;
  fileSize: number | null;
};

const initialInfo: BasicInfo = {
  name: "",
  phone: "",
  birthDate: "",
  passportNumber: "",
  destination: "日本",
  travelDate: "",
  occupation: ""
};

const initialDocuments: UploadedDocuments = {
  passport: null,
  idCard: null,
  bankStatement: null,
  photo: null
};

const occupationOptions = ["在职", "自由职业", "学生", "退休", "未成年人", "其他"] as const;
const stepNames: Record<IntakeStep, string> = {
  1: "办理说明",
  2: "基础信息",
  3: "上传资料",
  4: "确认提交",
  5: "提交完成"
};

const documents: DocumentItem[] = [
  {
    id: "passport",
    name: "护照首页",
    requirement: "请上传清晰照片，确保四角完整、无反光。"
  },
  {
    id: "idCard",
    name: "身份证正反面",
    requirement: "请上传身份证正面和反面照片。"
  },
  {
    id: "bankStatement",
    name: "银行流水",
    requirement: "请上传近 6 个月银行流水文件或截图。"
  },
  {
    id: "photo",
    name: "证件照",
    requirement: "请上传白底证件照。"
  }
];

const resumeStatusCopy: Record<string, { description: string; title: string }> = {
  approved: {
    description: "您的资料已经审核通过，顾问会继续为您推进后续办理。",
    title: "资料审核通过"
  },
  completed: {
    description: "您的签证办理已经完成，感谢您使用 AS VISA。",
    title: "签证办理完成"
  },
  need_more_docs: {
    description: "顾问需要您补充部分资料，请按提示上传即可。",
    title: "需要补充资料"
  },
  reviewing: {
    description: "顾问正在审核您的资料。如需补充资料，我们会通过企业微信联系您。",
    title: "顾问审核中"
  },
  submitted: {
    description: "我们已收到您的资料，正在等待顾问审核。",
    title: "资料已提交，等待顾问审核"
  }
};

const caseProgressSteps = [
  { id: "submitted", label: "Intake Submitted" },
  { id: "reviewing", label: "Reviewing" },
  { id: "need_more_docs", label: "Supplement Requested" },
  { id: "supplement_uploaded", label: "Supplement Uploaded" },
  { id: "processing", label: "Processing" },
  { id: "completed", label: "Completed" }
] as const;

const statusEstimatedTime: Record<string, string> = {
  approved: "预计 1-2 个工作日进入递交流程",
  completed: "已完成",
  need_more_docs: "请尽快补充资料，顾问会继续审核",
  processing: "预计 5-10 个工作日",
  reviewing: "预计今天 18:00 前完成审核",
  submitted: "预计今天 18:00 前开始审核"
};

function getCurrentProgressIndex(status?: string, hasSupplementUploaded?: boolean) {
  if (status === "completed") return 5;
  if (status === "approved" || status === "processing") return 4;
  if (hasSupplementUploaded) return 3;
  if (status === "need_more_docs") return 2;
  if (status === "reviewing") return 1;
  return 0;
}

function formatEventTime(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

function hasSupplementUploadedEvent(events?: ResumeCaseEvent[]) {
  return Boolean(events?.some((event) => event.title === "Supplement uploaded" || event.title === "补充资料已上传"));
}

export default function IntakePage() {
  const [step, setStep] = useState<IntakeStep>(1);
  const [info, setInfo] = useState<BasicInfo>(initialInfo);
  const [uploaded, setUploaded] = useState<UploadedDocuments>(initialDocuments);
  const [supplementRequest, setSupplementRequest] = useState<ActiveSupplementRequest | null>(null);
  const [supplementUploaded, setSupplementUploaded] = useState<Record<string, UploadedDocument>>({});
  const [resumeCase, setResumeCase] = useState<ResumeCaseResult | null>(null);
  const [showSupplementCenter, setShowSupplementCenter] = useState(false);
  const [isCheckingSupplement, setIsCheckingSupplement] = useState(true);
  const [isCheckingResume, setIsCheckingResume] = useState(false);
  const [isSupplementSubmitting, setIsSupplementSubmitting] = useState(false);
  const [supplementSubmitted, setSupplementSubmitted] = useState(false);
  const [supplementError, setSupplementError] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const missingDocuments = documents.filter((item) => !uploaded[item.id]);
  const allDocumentsUploaded = missingDocuments.length === 0;
  const requiredInfoComplete = Boolean(
    info.name.trim() &&
    info.phone.trim() &&
    info.passportNumber.trim() &&
    info.occupation
  );
  const supplementRequests: ResumeSupplementRequest[] = resumeCase?.supplementRequests ??
    (supplementRequest ? [{
      message: supplementRequest.message,
      requestedDocuments: supplementRequest.requestedDocuments,
      requestId: supplementRequest.requestId
    }] : []);
  const hasSupplementCenter = supplementRequests.length > 0;
  const shouldShowSupplementCenter = hasSupplementCenter && showSupplementCenter;
  const supplementMissingDocuments = supplementRequests.flatMap((requestItem) => (
    requestItem.requestedDocuments
      .filter((item) => !supplementUploaded[`${requestItem.requestId}:${item.id}`])
      .map((item) => ({ ...item, requestId: requestItem.requestId }))
  ));
  const allSupplementDocumentsUploaded = hasSupplementCenter && supplementMissingDocuments.length === 0;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const caseId = searchParams.get("caseId");
    const caseCode = searchParams.get("caseCode");

    if (!caseId && !caseCode) {
      setIsCheckingSupplement(false);
      return;
    }

    getActiveSupplementRequest({ caseCode, caseId })
      .then((request) => {
        setSupplementRequest(request);
        setShowSupplementCenter(Boolean(request));
      })
      .catch((error) => {
        console.warn("[AS VISA] Supplement request lookup failed.", error);
      })
      .finally(() => {
        setIsCheckingSupplement(false);
      });
  }, []);

  function updateInfo(field: keyof BasicInfo, value: string) {
    setInfo((current) => ({ ...current, [field]: value }));
  }

  function handleUpload(documentId: keyof UploadedDocuments, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploaded((current) => ({
      ...current,
      [documentId]: {
        file,
        fileMimeType: file.type || null,
        fileName: file.name,
        fileSize: file.size || null
      }
    }));
  }

  function handleSupplementUpload(documentId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSupplementUploaded((current) => ({
      ...current,
      [documentId]: {
        file,
        fileMimeType: file.type || null,
        fileName: file.name,
        fileSize: file.size || null
      }
    }));
  }

  async function handleBasicInfoNext() {
    if (!requiredInfoComplete || isCheckingResume) return;
    setIsCheckingResume(true);
    setSubmitError("");

    try {
      const existingCase = await getResumeCase(info.phone);

      if (existingCase.exists) {
        setResumeCase(existingCase);
        return;
      }

      setStep(3);
    } catch (error) {
      console.warn("[AS VISA] Resume lookup failed.", error);
      setSubmitError(error instanceof Error
        ? `查询已有案件失败：${error.message}`
        : "查询已有案件失败，请稍后重试。");
    } finally {
      setIsCheckingResume(false);
    }
  }

  async function handleSubmit() {
    if (!allDocumentsUploaded || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const uploadedEntries = documents
        .map((item) => ({ ...item, file: uploaded[item.id] }))
        .filter((item): item is DocumentItem & { file: UploadedDocument } => Boolean(item.file));

      const result = await submitIntake({
        basicInfo: info,
        documents: uploadedEntries.map((item) => ({
          documentName: item.name,
          documentType: item.id,
          file: item.file.file,
          fileMimeType: item.file.fileMimeType,
          fileName: item.file.fileName,
          fileSize: item.file.fileSize
        }))
      });

      if (result.mode === "resume") {
        const existingCase = await getResumeCase(info.phone);
        setResumeCase(existingCase.exists ? existingCase : {
          caseCode: result.caseCode,
          caseId: result.caseId,
          exists: true,
          status: result.status
        });
        return;
      }

      setSubmittedAt(new Date().toLocaleString("zh-CN", { hour12: false }));
      setStep(5);
    } catch (error) {
      console.warn("[AS VISA] Intake submit failed. Staying on review step.", error);
      setSubmitError("提交失败，请稍后重试或联系顾问。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSupplementSubmit() {
    if (!hasSupplementCenter || !allSupplementDocumentsUploaded || isSupplementSubmitting) return;
    setIsSupplementSubmitting(true);
    setSupplementError("");

    try {
      await Promise.all(supplementRequests.map((requestItem) => submitSupplement({
        documents: requestItem.requestedDocuments.map((item) => {
          const uploadedDocument = supplementUploaded[`${requestItem.requestId}:${item.id}`];
          return {
            documentName: item.name,
            documentType: item.id,
            file: uploadedDocument.file,
            fileMimeType: uploadedDocument.fileMimeType,
            fileName: uploadedDocument.fileName,
            fileSize: uploadedDocument.fileSize
          };
        }),
        requestId: requestItem.requestId
      })));

      setSubmittedAt(new Date().toLocaleString("zh-CN", { hour12: false }));
      setSupplementSubmitted(true);
      setResumeCase((current) => current ? {
        ...current,
        status: "reviewing",
        supplementRequests: []
      } : current);
    } catch (error) {
      console.warn("[AS VISA] Supplement submit failed.", error);
      setSupplementError(error instanceof Error
        ? `补充资料提交失败：${error.message}`
        : "补充资料提交失败，请稍后重试或联系顾问。");
    } finally {
      setIsSupplementSubmitting(false);
    }
  }

  if (isCheckingSupplement) {
    return (
      <main className={`${styles.page} noir-scope`}>
        <section className={styles.shell} aria-labelledby="intake-title">
          <header className={styles.header}>
            <div>
              <p className={styles.brand}>AS VISA</p>
              <span>资料办理</span>
            </div>
            <strong className={styles.caseChip}>日本旅游签证</strong>
          </header>
          <section className={styles.step}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>Checking</p>
              <h1 id="intake-title">正在确认资料状态</h1>
              <p>请稍候，我们正在为您确认是否有需要补充的资料。</p>
            </div>
          </section>
        </section>
      </main>
    );
  }

  if (resumeCase?.exists && !shouldShowSupplementCenter) {
    const statusCopy = resumeStatusCopy[resumeCase.status ?? "submitted"] ?? resumeStatusCopy.submitted;
    const currentProgressIndex = getCurrentProgressIndex(
      resumeCase.status,
      hasSupplementUploadedEvent(resumeCase.caseEvents)
    );
    const estimatedTime = statusEstimatedTime[resumeCase.status ?? "submitted"] ?? statusEstimatedTime.submitted;
    const caseEvents = resumeCase.caseEvents ?? [];

    return (
      <main className={`${styles.page} noir-scope`}>
        <section className={styles.shell} aria-labelledby="case-center-title">
          <header className={styles.header}>
            <div>
              <p className={styles.brand}>AS VISA</p>
              <span>案件中心</span>
            </div>
            <strong className={styles.caseChip}>{resumeCase.caseCode ?? "已有案件"}</strong>
          </header>

          <section className={styles.step}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>Case Center</p>
              <h1 id="case-center-title">您的签证案件</h1>
              <p>{statusCopy.description}</p>
            </div>

            <article className={styles.caseCard}>
              <div>
                <span>案件编号</span>
                <strong>{resumeCase.caseCode ?? "已创建"}</strong>
              </div>
              <div>
                <span>办理类型</span>
                <strong>{resumeCase.visaType ?? "日本旅游签证"}</strong>
              </div>
              <div>
                <span>出行国家</span>
                <strong>{resumeCase.destinationCountry ?? "日本"}</strong>
              </div>
              <div>
                <span>当前状态</span>
                <strong>{statusCopy.title}</strong>
              </div>
              <div>
                <span>预计时间</span>
                <strong>{estimatedTime}</strong>
              </div>
            </article>

            <section className={styles.progressTracker} aria-label="案件进度">
              {caseProgressSteps.map((item, index) => {
                const isActive = index === currentProgressIndex;
                const isDone = index < currentProgressIndex;
                return (
                  <article
                    className={`${styles.progressStep} ${isActive ? styles.progressStepActive : ""} ${isDone ? styles.progressStepDone : ""}`}
                    key={item.id}
                  >
                    <span>{isDone ? <Check size={13} strokeWidth={2.4} /> : index + 1}</span>
                    <strong>{item.label}</strong>
                  </article>
                );
              })}
            </section>

            {resumeCase.status === "need_more_docs" && hasSupplementCenter ? (
              <Button className={styles.primaryButton} onClick={() => setShowSupplementCenter(true)}>
                继续补充资料
              </Button>
            ) : null}

            <section className={styles.timelineCard} aria-label="案件时间线">
              <div className={styles.timelineHeader}>
                <h2>办理动态</h2>
                <span>{caseEvents.length} 条记录</span>
              </div>

              {caseEvents.length > 0 ? (
                <div className={styles.timelineList}>
                  {caseEvents.map((event) => (
                    <article className={styles.timelineItem} key={event.id}>
                      <span className={styles.timelineDot} />
                      <div>
                        <strong>{event.title}</strong>
                        {event.description ? <p>{event.description}</p> : null}
                        <time>{formatEventTime(event.created_at)}</time>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyTimeline}>暂无新的办理动态。资料更新后，我们会第一时间同步。</p>
              )}
            </section>

            <p className={styles.secondaryCopy}>您可以关闭页面，后续进展会通过企业微信通知。</p>
          </section>
        </section>
      </main>
    );
  }

  if (shouldShowSupplementCenter) {
    const supplementCaseCode = resumeCase?.caseCode ?? supplementRequest?.caseCode ?? "补充资料";

    return (
      <main className={`${styles.page} noir-scope`}>
        <section className={styles.shell} aria-labelledby="supplement-title">
          <header className={styles.header}>
            <div>
              <p className={styles.brand}>AS VISA</p>
              <span>补充资料</span>
            </div>
            <strong className={styles.caseChip}>{supplementCaseCode}</strong>
          </header>

          {!supplementSubmitted ? (
            <section className={styles.step}>
              <div className={styles.sectionHeader}>
                <p className={styles.kicker}>Supplement Center</p>
                <h1 id="supplement-title">请补充所需资料</h1>
                <p>无需重新填写基础信息，只需要上传顾问要求补充的文件。</p>
              </div>

              <div className={styles.documentList}>
                {supplementRequests.map((requestItem) => (
                  <section className={styles.summaryCard} key={requestItem.requestId}>
                    <article className={styles.supplementMessage}>
                      <span>顾问说明</span>
                      <p>{requestItem.message}</p>
                    </article>

                    <div className={styles.documentList}>
                      {requestItem.requestedDocuments.map((item) => {
                        const uploadKey = `${requestItem.requestId}:${item.id}`;
                        const file = supplementUploaded[uploadKey];
                        return (
                          <article className={styles.documentCard} key={uploadKey}>
                            <div className={styles.documentIcon}>
                              {file ? <Check size={18} strokeWidth={2.4} /> : <FileText size={18} strokeWidth={1.8} />}
                            </div>
                            <div className={styles.documentCopy}>
                              <h2>{item.name}</h2>
                              <span className={file ? styles.statusUploaded : styles.statusPending}>
                                {file ? "已上传" : "待上传"}
                              </span>
                              <p>{item.requirement}</p>
                              {file ? <strong>{file.fileName}</strong> : null}
                            </div>
                            <label className={file ? styles.reuploadButton : styles.uploadButton}>
                              <Upload size={15} strokeWidth={1.8} />
                              {file ? "重新上传" : "上传"}
                              <input accept="image/*,.pdf" onChange={(event) => handleSupplementUpload(uploadKey, event)} type="file" />
                            </label>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              {supplementMissingDocuments.length > 0 ? (
                <p className={styles.warning}>还有资料未上传，请补充后再提交。</p>
              ) : null}
              {supplementError ? <p className={styles.submitError}>{supplementError}</p> : null}

              <Button
                className={styles.primaryButton}
                disabled={!allSupplementDocumentsUploaded || isSupplementSubmitting}
                onClick={handleSupplementSubmit}
              >
                {isSupplementSubmitting ? "正在提交" : "提交补充资料"}
              </Button>
            </section>
          ) : (
            <section className={`${styles.step} ${styles.successStep}`}>
              <div className={styles.successIcon}>
                <Check size={30} strokeWidth={2.4} />
              </div>
              <h1 id="supplement-title">补充资料已提交</h1>
              <p>我们已收到您补充的资料，案件已返回顾问审核中。</p>

              <article className={styles.caseCard}>
                <div>
                  <span>提交时间</span>
                  <strong>{submittedAt}</strong>
                </div>
                <div>
                  <span>当前状态</span>
                  <strong>等待顾问审核</strong>
                </div>
                <div>
                  <span>后续通知</span>
                  <strong>企业微信</strong>
                </div>
              </article>

              <p className={styles.secondaryCopy}>您可以关闭页面，后续进展会通过企业微信通知。</p>
            </section>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className={`${styles.page} noir-scope`}>
      <section className={styles.shell} aria-labelledby="intake-title">
        <header className={styles.header}>
          <div>
            <p className={styles.brand}>AS VISA</p>
            <span>资料办理</span>
          </div>
          <strong className={styles.caseChip}>日本旅游签证</strong>
        </header>

        <section className={styles.stepStatus} aria-label={`第 ${step} 步，共 5 步`}>
          <div>
            <span>第 {step} / 5 步</span>
            <strong>{stepNames[step]}</strong>
          </div>
          <div className={styles.progress}>
            {[1, 2, 3, 4, 5].map((item) => (
              <span className={item <= step ? styles.progressDotActive : styles.progressDot} key={item} />
            ))}
          </div>
        </section>

        {step === 1 ? (
          <section className={styles.step}>
            <div className={styles.hero}>
              <p className={styles.kicker}>日本旅游签证</p>
              <h1 id="intake-title">签证资料填写</h1>
              <p>请按照提示填写信息并上传资料，我们会为您进行初步检查。</p>
            </div>

            <article className={styles.caseCard}>
              <div>
                <span>办理类型</span>
                <strong>日本旅游签证</strong>
              </div>
              <div>
                <span>当前状态</span>
                <strong>等待提交资料</strong>
              </div>
              <div>
                <span>预计用时</span>
                <strong>3-5 分钟</strong>
              </div>
            </article>

            <Button className={styles.primaryButton} onClick={() => setStep(2)}>
              开始填写
            </Button>
          </section>
        ) : null}

        {step === 2 ? (
          <section className={styles.step}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>基础信息</p>
              <h1 id="intake-title">请填写申请人信息</h1>
              <p>请确保信息与护照及办理资料一致。</p>
            </div>

            <section className={styles.formCard}>
              <div className={styles.formSection}>
                <h2>身份信息</h2>
                <label className={styles.field}>
                  <span>姓名</span>
                  <input onChange={(event) => updateInfo("name", event.target.value)} placeholder="请输入姓名" value={info.name} />
                </label>
                <label className={styles.field}>
                  <span>手机号</span>
                  <input inputMode="tel" onChange={(event) => updateInfo("phone", event.target.value)} placeholder="请输入手机号" value={info.phone} />
                </label>
                <label className={styles.field}>
                  <span>出生日期</span>
                  <input onChange={(event) => updateInfo("birthDate", event.target.value)} type="date" value={info.birthDate} />
                </label>
                <label className={styles.field}>
                  <span>护照号码</span>
                  <input onChange={(event) => updateInfo("passportNumber", event.target.value)} placeholder="请输入护照号码" value={info.passportNumber} />
                </label>
              </div>

              <div className={styles.formSection}>
                <h2>出行信息</h2>
                <label className={styles.field}>
                  <span>出行国家</span>
                  <input onChange={(event) => updateInfo("destination", event.target.value)} placeholder="日本" value={info.destination} />
                </label>
                <label className={styles.field}>
                  <span>出行时间</span>
                  <input onChange={(event) => updateInfo("travelDate", event.target.value)} type="date" value={info.travelDate} />
                </label>
                <label className={styles.field}>
                  <span>职业类型</span>
                  <select onChange={(event) => updateInfo("occupation", event.target.value)} value={info.occupation}>
                    <option value="">请选择职业类型</option>
                    {occupationOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            {!requiredInfoComplete ? <p className={styles.helperText}>请先完成必要信息。</p> : null}
            {submitError ? <p className={styles.submitError}>{submitError}</p> : null}
            <Button className={styles.primaryButton} disabled={!requiredInfoComplete || isCheckingResume} onClick={handleBasicInfoNext}>
              {isCheckingResume ? "正在查询案件" : "下一步，上传资料"}
            </Button>
          </section>
        ) : null}

        {step === 3 ? (
          <section className={styles.step}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>资料上传</p>
              <h1 id="intake-title">请上传所需资料</h1>
              <p>请按要求上传资料，完成后即可进入确认提交。</p>
            </div>

            <div className={styles.documentList}>
              {documents.map((item) => {
                const file = uploaded[item.id];
                return (
                  <article className={styles.documentCard} key={item.id}>
                    <div className={styles.documentIcon}>
                      {file ? <Check size={18} strokeWidth={2.4} /> : <FileText size={18} strokeWidth={1.8} />}
                    </div>
                    <div className={styles.documentCopy}>
                      <h2>{item.name}</h2>
                      <span className={file ? styles.statusUploaded : styles.statusPending}>
                        {file ? "已上传" : "待上传"}
                      </span>
                      <p>{item.requirement}</p>
                      {file ? <strong>{file.fileName}</strong> : null}
                    </div>
                    <label className={file ? styles.reuploadButton : styles.uploadButton}>
                      <Upload size={15} strokeWidth={1.8} />
                      {file ? "重新上传" : "上传"}
                      <input accept="image/*,.pdf" onChange={(event) => handleUpload(item.id, event)} type="file" />
                    </label>
                  </article>
                );
              })}
            </div>

            <p className={styles.trustNote}>资料仅用于签证办理，我们会妥善保存。</p>

            <Button className={styles.primaryButton} onClick={() => setStep(4)}>
              下一步，确认提交
            </Button>
          </section>
        ) : null}

        {step === 4 ? (
          <section className={styles.step}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>确认提交</p>
              <h1 id="intake-title">请确认资料信息</h1>
              <p>提交后，顾问会开始审核您的资料。</p>
            </div>

            <section className={styles.summaryCard}>
              <h2>申请人信息</h2>
              <dl>
                <div><dt>姓名</dt><dd>{info.name || "未填写"}</dd></div>
                <div><dt>手机号</dt><dd>{info.phone || "未填写"}</dd></div>
                <div><dt>出生日期</dt><dd>{info.birthDate || "未填写"}</dd></div>
                <div><dt>护照号码</dt><dd>{info.passportNumber || "未填写"}</dd></div>
                <div><dt>出行国家</dt><dd>{info.destination || "未填写"}</dd></div>
                <div><dt>出行时间</dt><dd>{info.travelDate || "未填写"}</dd></div>
                <div><dt>职业类型</dt><dd>{info.occupation || "未填写"}</dd></div>
              </dl>
            </section>

            <section className={styles.summaryCard}>
              <h2>已上传资料</h2>
              <div className={styles.uploadSummary}>
                {documents.filter((item) => uploaded[item.id]).map((item) => (
                  <span className={styles.uploadedTag} key={item.id}>已上传 · {item.name}</span>
                ))}
              </div>
            </section>

            <section className={styles.summaryCard}>
              <h2>待补充资料</h2>
              <div className={styles.uploadSummary}>
                {missingDocuments.length > 0 ? missingDocuments.map((item) => (
                  <span className={styles.missingTag} key={item.id}>待补充 · {item.name}</span>
                )) : <span className={styles.uploadedTag}>资料已全部上传</span>}
              </div>
            </section>

            {!allDocumentsUploaded ? (
              <p className={styles.warning}>还有资料未上传，请返回补充后再提交。</p>
            ) : null}
            {submitError ? <p className={styles.submitError}>{submitError}</p> : null}

            <div className={styles.actionStack}>
              <Button className={styles.primaryButton} disabled={!allDocumentsUploaded || isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? "正在提交" : "确认提交"}
              </Button>
              {!allDocumentsUploaded ? (
                <button className={styles.secondaryButton} onClick={() => setStep(3)} type="button">
                  返回上传资料
                </button>
              ) : null}
            </div>
          </section>
        ) : null}

        {step === 5 ? (
          <section className={`${styles.step} ${styles.successStep}`}>
            <div className={styles.successIcon}>
              <Check size={30} strokeWidth={2.4} />
            </div>
            <h1 id="intake-title">资料已提交</h1>
            <p>我们已收到您的资料，顾问会尽快完成审核。如需补充资料，我们会通过企业微信联系您。</p>

            <article className={styles.caseCard}>
              <div>
                <span>提交时间</span>
                <strong>{submittedAt}</strong>
              </div>
              <div>
                <span>办理类型</span>
                <strong>日本旅游签证</strong>
              </div>
              <div>
                <span>当前状态</span>
                <strong>顾问审核中</strong>
              </div>
              <div>
                <span>后续通知</span>
                <strong>企业微信</strong>
              </div>
            </article>

            <p className={styles.mvpNote}>提交记录功能将在后续版本开放。</p>
            <p className={styles.secondaryCopy}>返回首页 / 关闭页面即可，后续进展会通过企业微信通知。</p>
          </section>
        ) : null}
      </section>
    </main>
  );
}
