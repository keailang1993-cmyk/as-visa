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
          <p className="noir-micro">Mission Completed</p>
          <div className={styles.message}>
            <Check size={22} />
            <h1 className={styles.title} id="completion-title">
              All required documents have been received.
            </h1>
            <p className="noir-description">Your advisor will review everything shortly.</p>
          </div>
          <div className={styles.reviewTime}>
            <p className="noir-micro">Estimated review time</p>
            <p className={styles.time}>
              Today before 18:00.
            </p>
          </div>
          <Button className={styles.cta} onClick={() => router.push("/progress")}>
            View Progress
          </Button>
        </section>
      </Card>
    </main>
  );
}
