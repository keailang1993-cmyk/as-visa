"use client";

import { useRouter } from "next/navigation";
import { Button, Check, ClipboardCheck, Clock, ShieldCheck } from "@as-visa/ui";
import styles from "./welcome.module.css";

const features = [
  {
    icon: ClipboardCheck,
    title: "专业顾问协助",
    description: "每一步都有清晰指引，减少反复沟通。"
  },
  {
    icon: Clock,
    title: "实时办理进度",
    description: "资料提交、审核、递交、出签状态清晰可见。"
  },
  {
    icon: ShieldCheck,
    title: "安全资料处理",
    description: "资料仅用于签证办理，并加密保存。"
  }
] as const;

export default function WelcomePage() {
  const router = useRouter();

  return (
    <main className={`${styles.page} noir-scope`}>
      <section className={styles.shell} aria-labelledby="welcome-title">
        <div className={styles.statusBar} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.statusIcons}>
            <span />
            <span />
            <span />
          </span>
        </div>

        <header className={styles.header}>
          <div className={styles.logoMark} aria-label="AS VISA">
            AS
          </div>
          <p className={styles.brand}>AS VISA</p>
        </header>

        <section className={styles.hero}>
          <p className={styles.kicker}>签证办理助手</p>
          <h1 className={styles.title} id="welcome-title">
            让签证办理，变得简单。
          </h1>
          <p className={styles.subtitle}>从资料提交到进度追踪，AS VISA 会一步一步引导你完成办理。</p>
        </section>

        <section className={styles.features} aria-label="服务特点">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className={styles.featureCard} key={feature.title}>
                <span className={styles.featureIcon} aria-hidden="true">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <h2>{feature.title}</h2>
                  <p>{feature.description}</p>
                </div>
              </article>
            );
          })}
        </section>

        <div className={styles.actionArea}>
          <Button className={styles.primaryButton} icon={<Check size={16} />} onClick={() => router.push("/login")}>
            开始办理
          </Button>
          <p className={styles.trustNote}>移动端体验已针对微信内访问优化。</p>
        </div>
      </section>
    </main>
  );
}
