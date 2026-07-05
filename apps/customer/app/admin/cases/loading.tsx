import styles from "../admin.module.css";

export default function AdminCasesLoading() {
  return (
    <main className={`${styles.page} noir-scope`}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.brand}>AS VISA Admin</p>
            <h1>案件审核</h1>
            <p>正在加载案件</p>
          </div>
        </header>
        <section className={styles.stateCard}>正在加载案件</section>
      </section>
    </main>
  );
}
