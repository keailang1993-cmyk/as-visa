"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, ClipboardCheck, Clock, Home, MessageCircle, ShieldCheck, User } from "@as-visa/ui";
import { getCurrentMission, missionFlow } from "../lib/missionFlow";
import styles from "./mission.module.css";

const progressSteps = ["资料上传", "AI 检查", "人工审核", "出签结果"] as const;

export default function MissionPage() {
  const router = useRouter();
  const [currentMission, setCurrentMission] = useState(getCurrentMission);

  useEffect(() => {
    setCurrentMission(getCurrentMission());
  }, []);

  const missionTitle = currentMission.isComplete
    ? "资料提交完成"
    : currentMission.mission.documentName === "护照"
      ? "上传护照首页"
      : currentMission.mission.title;

  const progressValue = currentMission.isComplete
    ? 100
    : Math.round((currentMission.index / Math.max(missionFlow.length, 1)) * 100);

  return (
    <main className={`${styles.page} noir-scope`}>
      <section className={styles.phone} aria-labelledby="mission-title">
        <div className={styles.statusBar} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.statusIcons}>
            <span />
            <span />
            <span />
          </span>
        </div>

        <header className={styles.header}>
          <p className={styles.brand}>AS VISA</p>
          <button aria-label="通知" className={styles.iconButton} type="button">
            <Bell size={18} strokeWidth={1.8} />
          </button>
        </header>

        <section className={styles.hero} aria-label="今日任务概览">
          <h1 className={styles.greeting}>你好，张先生 👋</h1>
          <p className={styles.lede}>我们已为你生成今日任务</p>
        </section>

        <section className={styles.content}>
          <button
            className={styles.missionCard}
            disabled={currentMission.isComplete}
            onClick={() => router.push("/upload")}
            type="button"
          >
            <div className={styles.cardCopy}>
              <p className={styles.kicker}>
                今日任务 <span>{currentMission.isComplete ? missionFlow.length : currentMission.index + 1}/{missionFlow.length}</span>
              </p>
              <h2 className={styles.title} id="mission-title">
                {missionTitle}
              </h2>
              <p className={styles.description}>
                {currentMission.isComplete ? "所有必要资料已经提交完成。" : "这是签证申请的第一步，请确保信息清晰可见"}
              </p>
            </div>
            <div className={styles.passportScene} aria-hidden="true">
              <div className={styles.documentSheet} />
              <div className={styles.passportBook}>
                <span>PASSPORT</span>
                <div className={styles.passportGlobe} />
              </div>
            </div>
            <div className={styles.tags}>
              <span><Clock size={13} />预计用时 30 秒</span>
              <span><ShieldCheck size={13} />AI 自动检测</span>
            </div>
          </button>

          <article className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <ClipboardCheck size={18} strokeWidth={1.8} />
            </div>
            <div>
              <h3>为什么需要这份材料？</h3>
              <p>护照是核实身份和国籍的重要文件，用于签证申请的基础审核。</p>
            </div>
            <ChevronDown className={styles.infoArrow} size={17} strokeWidth={1.8} />
          </article>

          <section className={styles.progressBlock} aria-label="整体进度">
            <div className={styles.progressHeader}>
              <h3>整体进度</h3>
              <span>已完成 {progressValue}%</span>
            </div>
            <div className={styles.progressRail} aria-hidden="true">
              {progressSteps.map((step, index) => (
                <span
                  className={index <= currentMission.index ? styles.progressDotActive : styles.progressDot}
                  key={step}
                />
              ))}
            </div>
            <div className={styles.progressLabels}>
              {progressSteps.map((step) => (
                <span key={step}>{step}</span>
              ))}
            </div>
          </section>
        </section>

        <nav className={styles.bottomNav} aria-label="主导航">
          <button className={styles.navItemActive} type="button">
            <Home size={19} fill="currentColor" strokeWidth={1.8} />
            首页
          </button>
          <button className={styles.navItem} type="button">
            <ClipboardCheck size={19} strokeWidth={1.8} />
            进度
          </button>
          <button className={styles.navItem} type="button">
            <MessageCircle size={19} strokeWidth={1.8} />
            消息
          </button>
          <button className={styles.navItem} type="button">
            <User size={19} strokeWidth={1.8} />
            我的
          </button>
        </nav>
      </section>
    </main>
  );
}
