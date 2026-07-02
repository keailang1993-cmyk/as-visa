"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Check } from "@as-visa/ui";
import styles from "./completion.module.css";

export default function CompletionPage() {
  const router = useRouter();

  return (
    <main className={`${styles.page} noir-scope`}>
      <Card className={styles.card}>
        <section className={styles.completion} aria-labelledby="completion-title">
          <p className="noir-micro">资料提交完成</p>
          <div className={styles.message}>
            <Check size={22} />
            <h1 className={styles.title} id="completion-title">
              资料已经全部收到
            </h1>
            <p className="noir-description">有任何进展，我们会第一时间通知您。</p>
          </div>
          <div className={styles.reviewTime}>
            <p className="noir-micro">预计审核时间</p>
            <p className={styles.time}>
              顾问将在今天 18:00 前完成审核
            </p>
          </div>
          <Button className={styles.cta} onClick={() => router.push("/progress")}>
            查看办理进度
          </Button>
        </section>
      </Card>
    </main>
  );
}
