"use client";

import { useRouter } from "next/navigation";
import { Button, Check } from "@as-visa/ui";
import styles from "./completion.module.css";

export default function CompletionPage() {
  const router = useRouter();

  return (
    <main className={`${styles.page} noir-scope`}>
      <section className={styles.phone} aria-labelledby="completion-title">
        <div className={styles.statusBar} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.statusIcons}><span /><span /><span /></span>
        </div>

        <section className={styles.completion}>
          <div className={styles.iconWrap}>
            <Check size={30} strokeWidth={2.4} />
          </div>
          <h1 className={styles.title} id="completion-title">资料已经全部收到</h1>
          <p className={styles.description}>
            顾问将在今天 18:00 前完成审核。<br />
            有任何进展，我们会第一时间通知您。
          </p>
        </section>

        <Button className={styles.cta} onClick={() => router.push("/progress")}>
          查看办理进度
        </Button>
        <p className={styles.secondaryText}>您可以关闭页面，后续进展会通过企业微信通知。</p>
      </section>
    </main>
  );
}
