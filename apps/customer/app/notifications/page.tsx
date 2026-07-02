"use client";

import { Card, NotificationCard } from "@as-visa/ui";
import styles from "./notifications.module.css";

const notifications = [
  {
    id: "advisor-updated-progress",
    title: "Advisor Updated Progress",
    description: "Your application timeline has been updated.",
    meta: "Just now"
  },
  {
    id: "need-additional-documents",
    title: "Need Additional Documents",
    description: "Your advisor may request one more supporting document.",
    meta: "12 minutes ago"
  },
  {
    id: "passport-approved",
    title: "Passport Approved",
    description: "Your passport upload has passed review.",
    meta: "Today"
  }
];

export default function NotificationsPage() {
  return (
    <main className={`${styles.page} noir-scope`}>
      <Card className={styles.card}>
        <section className={styles.notifications} aria-labelledby="notifications-title">
          <div className={styles.header}>
            <p className="noir-micro">Notifications</p>
            <h1 className={styles.title} id="notifications-title">
              Notification Center
            </h1>
            <p className="noir-description">Newest updates appear first.</p>
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
