"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AIThinking, Card, StatusBadge } from "@as-visa/ui";
import { getCurrentMission, missionFlow, setStoredMissionIndex } from "../lib/missionFlow";
import styles from "./ai-review.module.css";

const baseReviewStates = ["Reviewing...", "Checking validity...", "Checking completeness...", "Review Complete."] as const;

export default function AIReviewPage() {
  const router = useRouter();
  const [currentMission] = useState(getCurrentMission);
  const [step, setStep] = useState(0);
  const reviewStates = currentMission.isComplete
    ? baseReviewStates
    : [
        baseReviewStates[0],
        currentMission.mission.detectedLabel,
        baseReviewStates[1],
        baseReviewStates[2],
        baseReviewStates[3]
      ];

  useEffect(() => {
    if (step >= reviewStates.length - 1) {
      const completeTimer = window.setTimeout(() => {
        const nextMissionIndex = currentMission.index + 1;
        setStoredMissionIndex(nextMissionIndex);
        router.push(nextMissionIndex >= missionFlow.length ? "/completion" : "/mission");
      }, 850);

      return () => window.clearTimeout(completeTimer);
    }

    const timer = window.setTimeout(() => {
      setStep((currentStep) => currentStep + 1);
    }, 780);

    return () => window.clearTimeout(timer);
  }, [currentMission.index, router, reviewStates.length, step]);

  const isComplete = step === reviewStates.length - 1;

  return (
    <main className={`${styles.page} noir-scope`}>
      <Card className={styles.card}>
        <section className={styles.review} aria-labelledby="ai-review-title">
          <div className={styles.header}>
            <p className="noir-micro">AI Review</p>
            <StatusBadge status={isComplete ? "complete" : "active"} />
          </div>
          <h1 className={styles.title} id="ai-review-title">
            {currentMission.isComplete ? "Review complete" : `Reviewing ${currentMission.mission.title.replace("Upload ", "").toLowerCase()}`}
          </h1>
          <div aria-live="polite" className={styles.state} key={reviewStates[step]}>
            {isComplete ? <span>{reviewStates[step]}</span> : <AIThinking label={reviewStates[step]} />}
          </div>
        </section>
      </Card>
    </main>
  );
}
