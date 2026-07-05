import Link from "next/link";
import { notFound } from "next/navigation";
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

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.dataItem}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

export default async function AdminCaseDetailPage({ params }: AdminCaseDetailPageProps) {
  const { caseId } = await params;
  const { caseEvents, documents, error, visaCase } = await getAdminCaseDetail(caseId);

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
                      <p className={styles.muted}>文件预览将在下一版本开放。</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h2>Case Events</h2>
                {caseEvents.length === 0 ? <p className={styles.muted}>暂无案件事件</p> : null}
                <div className={styles.eventList}>
                  {caseEvents.map((event) => (
                    <article className={styles.eventCard} key={event.id}>
                      <div>
                        <span className={styles.label}>{event.event_type}</span>
                        <span className={styles.value}>{event.title}</span>
                      </div>
                      <p className={styles.muted}>{event.description ?? "无描述"}</p>
                      <span className={styles.filePath}>{formatDateTime(event.created_at)}</span>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className={`${styles.card} ${styles.actionPanel}`}>
              <h2>Staff Actions</h2>
              <p className={styles.muted}>更新案件状态后，系统会同步写入一条 case event。</p>
              <StatusUpdateForm caseId={visaCase.id} currentStatus={visaCase.status} />
            </aside>
          </section>
        ) : null}
      </section>
    </main>
  );
}
