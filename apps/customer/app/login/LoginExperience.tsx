"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, OTPInput, PhoneInput } from "@as-visa/ui";
import { setStoredMissionIndex } from "../lib/missionFlow";
import styles from "./login.module.css";

export function LoginExperience() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
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
        <div className={styles.logo} aria-label="AS VISA">
          AS
        </div>

        <div className={styles.copy}>
          <p className="noir-micro">AS VISA</p>
          <h1 className={styles.title} id="login-title">
            欢迎回来
          </h1>
          <p className={styles.description}>请使用手机号登录，继续完成您的签证办理。</p>
        </div>

        <Card className={styles.panel}>
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <PhoneInput
              autoFocus
              label="手机号"
              onChange={(event) => setPhone(event.target.value)}
              placeholder="请输入手机号"
              value={phone}
            />
            <OTPInput label="短信验证码" onChange={setCode} value={code} />
            <Button disabled={!canSubmit} loading={isLoading} type="submit">
              继续办理
            </Button>
            <p aria-live="polite" className={styles.message}>
              {message}
            </p>
          </form>
        </Card>
      </section>
    </main>
  );
}
