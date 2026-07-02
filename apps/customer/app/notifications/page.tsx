"use client";

import { Card, NotificationCard } from "@as-visa/ui";
import styles from "./notifications.module.css";

const notifications = [
  {
    id: "advisor-updated-progress",
    title: "顾问已更新进度",
    description: "您的办理进度已更新。",
    meta: "刚刚"
  },
  {
    id: "need-additional-documents",
    title: "需要补充资料",
    description: "顾问可能会请您补充一份辅助材料。",
    meta: "12 分钟前"
  },
  {
    id: "passport-approved",
    title: "护照资料已通过",
    description: "您上传的护照资料已通过初步检查。",
    meta: "今天"
  }
];

export default function NotificationsPage() {
  return (
    <main className={`${styles.page} noir-scope`}>
      <Card className={styles.card}>
        <section className={styles.notifications} aria-labelledby="notifications-title">
          <div className={styles.header}>
            <p className="noir-micro">通知中心</p>
            <h1 className={styles.title} id="notifications-title">
              最新通知
            </h1>
            <p className="noir-description">最新进展会优先显示。</p>
          </div>
          <div className={styles.list}>
            {notifications.map((notification) => (
              <NotificationCard
                description={notification.description}
                key={notification.id}
                meta={notification.meta}
                title={notification.title}
              />
            ))}
          </div>
        </section>
      </Card>
    </main>
  );
}
