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
  const [message, setMessage] = useState("Enter the phone number connected to your visa case.");

  const canSubmit = phone.trim().length >= 7 && code.length === 6;

  function handleSubmit() {
    if (!canSubmit) {
      setMessage("Enter your phone number and the 6 digit SMS code.");
      return;
    }

    setIsLoading(true);
    setMessage("Verifying secure access.");

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
            Continue your mission.
          </h1>
          <p className={styles.description}>Use your phone number and SMS verification code.</p>
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
              label="Phone number"
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Enter phone number"
              value={phone}
            />
            <OTPInput label="SMS verification code" onChange={setCode} value={code} />
            <Button disabled={!canSubmit} loading={isLoading} type="submit">
              Continue
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
