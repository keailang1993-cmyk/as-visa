"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Bot, Check, ClipboardCheck, Clock, Home, MessageCircle, ShieldCheck, User } from "@as-visa/ui";
import { getCurrentMission, missionFlow, setStoredMissionIndex } from "../lib/missionFlow";
import styles from "./ai-review.module.css";

const baseReviewStates = ["正在检查资料...", "正在检查有效期", "正在检查完整性", "初步检查完成"] as const;
const checklist = ["识别护照信息", "检查有效期", "检查完整性", "检查照片质量"] as const;

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
  const progressValue = Math.min(100, Math.round(((step + 1) / reviewStates.length) * 100));

  return (
    <main className={`${styles.page} noir-scope`}>
      <section className={styles.phone} aria-labelledby="ai-review-title">
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
          <p className={styles.kicker}>AI 初步检查</p>
          <h1 className={styles.title} id="ai-review-title">AI 正在检查资料</h1>
          <p className={styles.description}>请稍候，我们正在检查照片清晰度和资料完整性。</p>
        </section>

        <section className={styles.reviewCard} aria-live="polite">
          <div className={styles.progressCircle} style={{ "--progress": `${progressValue}%` } as CSSProperties}>
            <Bot size={26} strokeWidth={1.8} />
            <strong>{progressValue}%</strong>
          </div>
          <p className={styles.currentState}>{isComplete ? reviewStates[step] : reviewStates[step]}</p>
          <div className={styles.checklist}>
            {checklist.map((item, index) => {
              const checked = step > index || isComplete;
              return (
                <span className={checked ? styles.checkedItem : styles.pendingItem} key={item}>
                  {checked ? <Check size={14} strokeWidth={2.6} /> : <Clock size={14} strokeWidth={1.8} />}
                  {item}
                </span>
              );
            })}
          </div>
        </section>

        <p className={styles.estimate}>
          <ShieldCheck size={15} strokeWidth={1.8} />
          预计 15-30 秒完成
        </p>

        <nav className={styles.bottomNav} aria-label="主导航">
          <span className={styles.navItemActive}><Home size={19} fill="currentColor" />首页</span>
          <span className={styles.navItem}><ClipboardCheck size={19} />进度</span>
          <span className={styles.navItem}><MessageCircle size={19} />消息</span>
          <span className={styles.navItem}><User size={19} />我的</span>
        </nav>
      </section>
    </main>
  );
}
