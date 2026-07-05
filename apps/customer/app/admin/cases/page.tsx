import Link from "next/link";
import styles from "../admin.module.css";
import { formatDateTime, getAdminCases } from "../_lib/adminData";
import { isCaseStatus, statusLabels } from "../_lib/status";

export const dynamic = "force-dynamic";

type AdminCasesPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

const filters = ["all", "submitted", "reviewing", "need_more_docs", "completed"] as const;

export default async function AdminCasesPage({ searchParams }: AdminCasesPageProps) {
  const params = await searchParams;
  const activeStatus = params?.status ?? "all";
  const { cases, error } = await getAdminCases(activeStatus);

  return (
    <main className={`${styles.page} noir-scope`}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.brand}>AS VISA Admin</p>
            <h1>案件审核</h1>
            <p>查看客户提交的签证资料，按状态筛选并进入详情处理。</p>
          </div>
        </header>

        <nav className={styles.filterBar} aria-label="案件状态筛选">
          {filters.map((item) => {
            const href = item === "all" ? "/admin/cases" : `/admin/cases?status=${item}`;
            const label = item === "all" ? "All" : isCaseStatus(item) ? statusLabels[item] : item;
            return (
              <Link className={activeStatus === item ? styles.filterActive : styles.filter} href={href} key={item}>
                {label}
              </Link>
            );
          })}
        </nav>

        {error ? <section className={styles.stateCard}>无法加载案件，请稍后重试。</section> : null}
        {!error && cases.length === 0 ? <section className={styles.stateCard}>暂无客户案件</section> : null}

        {!error && cases.length > 0 ? (
          <section className={styles.card}>
            {cases.map((visaCase) => (
              <Link className={styles.caseRow} href={`/admin/cases/${visaCase.id}`} key={visaCase.id}>
                <span>
                  <span className={styles.label}>Case</span>
                  <span className={styles.value}>{visaCase.case_code}</span>
                </span>
                <span>
                  <span className={styles.label}>Applicant</span>
                  <span className={styles.value}>{visaCase.applicant_name}</span>
                </span>
                <span>
                  <span className={styles.label}>Phone</span>
                  <span className={styles.value}>{visaCase.applicant_phone}</span>
                </span>
                <span>
                  <span className={styles.label}>Visa</span>
                  <span className={styles.value}>{visaCase.visa_type}</span>
                </span>
                <span>
                  <span className={styles.label}>Destination</span>
                  <span className={styles.value}>{visaCase.destination_country}</span>
                </span>
                <span>
                  <span className={styles.label}>Status</span>
                  <span className={styles.statusBadge}>
                    {isCaseStatus(visaCase.status) ? statusLabels[visaCase.status] : visaCase.status}
                  </span>
                </span>
                <span>
                  <span className={styles.label}>Created</span>
                  <span className={styles.value}>{formatDateTime(visaCase.created_at)}</span>
                </span>
              </Link>
            ))}
          </section>
        ) : null}
      </section>
    </main>
  );
}
