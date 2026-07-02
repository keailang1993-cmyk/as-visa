"use client";

import { Card, Timeline } from "@as-visa/ui";
import styles from "./progress.module.css";

const progressSteps = [
  {
    id: "order-created",
    label: "Order Created",
    status: "complete" as const
  },
  {
    id: "passport-uploaded",
    label: "Passport Uploaded",
    status: "complete" as const
  },
  {
    id: "id-uploaded",
    label: "ID Uploaded",
    status: "complete" as const
  },
  {
    id: "bank-statement-uploaded",
    label: "Bank Statement Uploaded",
    status: "complete" as const
  },
  {
    id: "ai-review-complete",
    label: "AI Review Complete",
    status: "complete" as const
  },
  {
    id: "advisor-review",
    label: "Advisor Review",
    status: "active" as const
  },
  {
    id: "waiting-submission",
    label: "Waiting Submission",
    status: "idle" as const
  },
  {
    id: "visa-submitted",
    label: "Visa Submitted",
    status: "idle" as const
  }
];

export default function ProgressPage() {
  return (
    <main className={`${styles.page} noir-scope`}>
      <Card className={styles.card}>
        <section className={styles.progress} aria-labelledby="progress-title">
          <div className={styles.header}>
            <p className="noir-micro">Progress</p>
            <h1 className={styles.title} id="progress-title">
              Application Timeline
            </h1>
            <p className="noir-description">Read-only status of your visa delivery process.</p>
          </div>
          <Timeline steps={progressSteps} />
        </section>
      </Card>
    </main>
  );
}
