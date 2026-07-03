"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Check, ChevronDown, LoaderCircle, ShieldCheck, Smartphone, X } from "@as-visa/ui";
import { setStoredMissionIndex } from "../lib/missionFlow";
import styles from "./login.module.css";

export function LoginExperience() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("请输入与签证订单绑定的手机号。");

  const canSubmit = phone.trim().length >= 7 && code.length === 6;

  function handleSubmit() {
    if (!canSubmit) {
      setMessage("请输入手机号和 6 位短信验证码。");
      return;
    }

    setIsLoading(true);
    setMessage("正在验证登录信息。");

    window.setTimeout(() => {
      setStoredMissionIndex(0);
      router.push("/mission");
    }, 520);
  }

  return (
    <main className={`${styles.page} noir-scope`}>
      <section className={styles.shell} aria-labelledby="login-title">
        <div className={styles.statusBar} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.statusIcons}>
            <span />
            <span />
            <span />
          </span>
        </div>

        <div className={styles.language}>
          <button className={styles.languageButton} type="button">
            中文
            <ChevronDown aria-hidden size={12} strokeWidth={2} />
          </button>
        </div>

        <header className={styles.hero}>
          <div className={styles.logoMark} aria-label="AS VISA">
            AS
          </div>
          <p className={styles.brand}>AS VISA</p>
          <h1 className={styles.title} id="login-title">
            欢迎回来
          </h1>
          <p className={styles.description}>请使用手机号登录，继续完成您的签证办理流程。</p>
        </header>

        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <label className={styles.field}>
            <Smartphone aria-hidden className={styles.fieldIcon} size={17} strokeWidth={1.7} />
            <span className={styles.countryCode}>+86</span>
            <input
              autoComplete="tel"
              autoFocus
              className={styles.textInput}
              inputMode="tel"
              onChange={(event) => setPhone(event.target.value)}
              placeholder="请输入手机号"
              type="tel"
              value={phone}
            />
            {phone ? (
              <button
                aria-label="清除手机号"
                className={styles.clearButton}
                onClick={() => setPhone("")}
                type="button"
              >
                <X aria-hidden size={13} strokeWidth={2.4} />
              </button>
            ) : null}
          </label>

          <label className={styles.field}>
            <ShieldCheck aria-hidden className={styles.fieldIcon} size={17} strokeWidth={1.7} />
            <input
              autoComplete="one-time-code"
              className={styles.textInput}
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="请输入验证码"
              value={code}
            />
            <button className={styles.codeButton} type="button">
              {code.length === 6 ? "重新发送 (56s)" : "获取验证码"}
            </button>
          </label>

          <label className={styles.agreement}>
            <input
              checked={hasAgreed}
              className={styles.checkboxInput}
              onChange={(event) => setHasAgreed(event.target.checked)}
              type="checkbox"
            />
            <span className={styles.checkbox} aria-hidden="true">
              <Check size={11} strokeWidth={3} />
            </span>
            <span>
              我已阅读并同意 <strong>《用户服务协议》</strong> 和 <strong>《隐私政策》</strong>
            </span>
          </label>

          <Button className={styles.primaryButton} loading={isLoading} type="submit">
            继续办理
          </Button>

          <div className={styles.divider} aria-hidden="true">
            <span />
            <em>或</em>
            <span />
          </div>

          <button className={styles.wechatButton} type="button">
            <span className={styles.wechatIcon} aria-hidden="true">
              微
            </span>
            微信登录
          </button>

          <p aria-live="polite" className={styles.message}>
            {isLoading ? (
              <>
                正在验证登录信息 <LoaderCircle aria-hidden className="noir-spinner" size={12} strokeWidth={2} />
              </>
            ) : (
              message
            )}
          </p>
        </form>

        <p className={styles.legal}>登录即表示您同意我们的服务条款和隐私政策</p>
      </section>
    </main>
  );
}
