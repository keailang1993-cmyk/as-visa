import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Send,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import { notFound } from "next/navigation";
import { DocumentPreviewButton } from "../../_components/DocumentPreviewButton";
import { InternalNotesPanel } from "../../_components/InternalNotesPanel";
import { SupplementRequestForm } from "../../_components/SupplementRequestForm";
import { StatusUpdateForm } from "../../_components/StatusUpdateForm";
import styles from "../../admin.module.css";
import {
  formatDate,
  formatDateTime,
  formatFileSize,
  getAdminCaseDetail
} from "../../_lib/adminData";
import { isCaseStatus, statusLabels } from "../../_lib/status";

export const dynamic = "force-dynamic";

type AdminCaseDetailPageProps = {
  params: Promise<{
    caseId: string;
  }>;
};

const eventIcons: Record<string, LucideIcon> = {
  completed: CheckCircle2,
  intake_submitted: FileCheck2,
  need_more_docs: AlertCircle,
  processing: Clock3,
  ready_to_submit: ShieldCheck,
  reviewing: Clock3,
  submitted: FileCheck2,
  submitted_embassy: Send,
  supplement_requested: AlertCircle,
  supplement_uploaded: FileCheck2
};

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.dataItem}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

function TimelineIcon({ eventType }: { eventType: string }) {
  const Icon = eventIcons[eventType] ?? Clock3;
  return <Icon aria-hidden="true" size={15} strokeWidth={2} />;
}

export default async function AdminCaseDetailPage({ params }: AdminCaseDetailPageProps) {
  const { caseId } = await params;
  const { caseEvents, caseNotes, documents, error, visaCase } = await getAdminCaseDetail(caseId);

  if (!error && !visaCase) {
    notFound();
  }

  return (
    <main className={`${styles.page} noir-scope`}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.brand}>AS VISA Admin</p>
            <h1>{visaCase?.case_code ?? "案件详情"}</h1>
            <p>审核客户资料、查看上传文件路径，并更新案件状态。</p>
          </div>
          <Link className={styles.backLink} href="/admin/cases">
            返回案件列表
          </Link>
        </header>

        {error ? <section className={styles.stateCard}>无法加载案件，请稍后重试。</section> : null}

        {visaCase ? (
          <section className={styles.detailGrid}>
            <div className={styles.card}>
              <section className={styles.section}>
                <h2>Case Overview</h2>
                <div className={styles.dataGrid}>
                  <DataItem label="case_code" value={visaCase.case_code} />
                  <DataItem label="status" value={isCaseStatus(visaCase.status) ? statusLabels[visaCase.status] : visaCase.status} />
                  <DataItem label="visa_type" value={visaCase.visa_type} />
                  <DataItem label="destination_country" value={visaCase.destination_country} />
                  <DataItem label="created_at" value={formatDateTime(visaCase.created_at)} />
                </div>
              </section>

              <section className={styles.section}>
                <h2>Applicant Information</h2>
                <div className={styles.dataGrid}>
                  <DataItem label="applicant_name" value={visaCase.applicant_name} />
                  <DataItem label="applicant_phone" value={visaCase.applicant_phone} />
                  <DataItem label="applicant_birth_date" value={formatDate(visaCase.applicant_birth_date)} />
                  <DataItem label="passport_number" value={visaCase.passport_number} />
                  <DataItem label="travel_date" value={formatDate(visaCase.travel_date)} />
                  <DataItem label="occupation_type" value={visaCase.occupation_type} />
                </div>
              </section>

              <section className={styles.section}>
                <h2>Uploaded Documents</h2>
                {documents.length === 0 ? <p className={styles.muted}>暂无上传资料</p> : null}
                <div className={styles.documentList}>
                  {documents.map((document) => (
                    <article className={styles.documentCard} key={document.id}>
                      <div>
                        <span className={styles.label}>{document.document_type}</span>
                        <span className={styles.value}>{document.document_name}</span>
                      </div>
                      <div className={styles.documentMeta}>
                        <DataItem label="file_name" value={document.file_name} />
                        <DataItem label="file_size" value={formatFileSize(document.file_size)} />
                        <DataItem label="file_mime_type" value={document.file_mime_type ?? "未记录"} />
                        <DataItem label="status" value={document.status} />
                      </div>
                      <p className={styles.filePath}>file_path: {document.file_path || "未记录"}</p>
                      <DocumentPreviewButton documentId={document.id} />
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className={styles.sideColumn}>
              <section className={`${styles.card} ${styles.timelinePanel}`} aria-labelledby="case-timeline-heading">
                <div className={styles.timelineHeader}>
                  <div>
                    <span className={styles.label}>Timeline</span>
                    <h2 id="case-timeline-heading">案件动态</h2>
                  </div>
                  <span className={styles.timelineCount}>{caseEvents.length}</span>
                </div>

                {caseEvents.length === 0 ? <p className={styles.muted}>暂无案件事件</p> : null}

                {caseEvents.length > 0 ? (
                  <ol className={styles.timelineList}>
                    {caseEvents.map((event) => (
                      <li className={styles.timelineItem} key={event.id}>
                        <span className={styles.timelineConnector} aria-hidden="true" />
                        <span className={styles.timelineDot}>
                          <TimelineIcon eventType={event.event_type} />
                        </span>
                        <article className={styles.timelineContent}>
                          <div className={styles.timelineMeta}>
                            <span>{formatDateTime(event.created_at)}</span>
                            {event.staff_name ? <span>{event.staff_name}</span> : null}
                          </div>
                          <h3>{event.title}</h3>
                          <p>{event.description ?? "无描述"}</p>
                        </article>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </section>

              <section className={`${styles.card} ${styles.actionPanel}`}>
                <h2>Staff Actions</h2>
                <p className={styles.muted}>更新案件状态后，系统会同步写入一条 case event。</p>
                <SupplementRequestForm caseId={visaCase.id} />
                <StatusUpdateForm caseId={visaCase.id} currentStatus={visaCase.status} />
              </section>

              <InternalNotesPanel caseId={visaCase.id} initialNotes={caseNotes} />
            </aside>
          </section>
        ) : null}
      </section>
    </main>
  );
}
