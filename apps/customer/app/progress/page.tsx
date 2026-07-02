"use client";

import { Card, Timeline } from "@as-visa/ui";
import styles from "./progress.module.css";

const progressSteps = [
  {
    id: "order-created",
    label: "订单已确认",
    status: "complete" as const
  },
  {
    id: "documents-submitted",
    label: "资料已提交",
    status: "complete" as const
  },
  {
    id: "ai-review-complete",
    label: "AI 初步检查完成",
    status: "complete" as const
  },
  {
    id: "advisor-review",
    label: "顾问审核中",
    status: "active" as const
  },
  {
    id: "waiting-submission",
    label: "等待递交",
    status: "idle" as const
  },
  {
    id: "embassy-processing",
    label: "使馆处理中",
    status: "idle" as const
  },
  {
    id: "completed",
    label: "办理完成",
    status: "idle" as const
  }
];

export default function ProgressPage() {
  return (
    <main className={`${styles.page} noir-scope`}>
      <Card className={styles.card}>
        <section className={styles.progress} aria-labelledby="progress-title">
          <div className={styles.header}>
            <p className="noir-micro">办理进度</p>
            <h1 className={styles.title} id="progress-title">
              顾问审核中
            </h1>
            <p className="noir-description">预计今天 18:00 前完成审核</p>
          </div>
          <Timeline steps={progressSteps} />
        </section>
      </Card>
    </main>
  );
}
