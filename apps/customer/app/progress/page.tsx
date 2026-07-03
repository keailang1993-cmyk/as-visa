"use client";

import { Bell, Check, ClipboardCheck, Clock, Home, MessageCircle, User } from "@as-visa/ui";
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
      <section className={styles.phone} aria-labelledby="progress-title">
        <div className={styles.statusBar} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.statusIcons}><span /><span /><span /></span>
        </div>

        <div className={styles.header}>
          <p className={styles.brand}>AS VISA</p>
          <button aria-label="通知" className={styles.iconButton} type="button">
            <Bell size={18} strokeWidth={1.8} />
          </button>
        </div>

        <section className={styles.hero}>
          <p className={styles.kicker}>办理进度</p>
          <h1 className={styles.title} id="progress-title">办理进度</h1>
          <p className={styles.description}>有新的进展，我们会第一时间通知您。</p>
        </section>

        <section className={styles.statusCard}>
          <p>当前状态</p>
          <h2>顾问审核中</h2>
          <span>预计今天 18:00 前完成</span>
        </section>

        <section className={styles.timeline} aria-label="办理时间线">
          {progressSteps.map((step) => (
            <div className={styles.timelineItem} key={step.id}>
              <span className={step.status === "complete" ? styles.doneIcon : styles.waitIcon}>
                {step.status === "complete" ? <Check size={14} strokeWidth={2.6} /> : <Clock size={14} strokeWidth={1.8} />}
              </span>
              <strong>{step.label}</strong>
              <em>{step.status === "complete" ? "已完成" : step.status === "active" ? "进行中" : "未开始"}</em>
            </div>
          ))}
        </section>

        <nav className={styles.bottomNav} aria-label="主导航">
          <span className={styles.navItem}><Home size={19} />首页</span>
          <span className={styles.navItemActive}><ClipboardCheck size={19} fill="currentColor" />进度</span>
          <span className={styles.navItem}><MessageCircle size={19} />消息</span>
          <span className={styles.navItem}><User size={19} />我的</span>
        </nav>
      </section>
    </main>
  );
}
