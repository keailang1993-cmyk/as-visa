"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";
import { caseStatuses, statusLabels, type CaseStatus } from "../_lib/status";

type StatusUpdateFormProps = {
  caseId: string;
  currentStatus: string;
};

export function StatusUpdateForm({ caseId, currentStatus }: StatusUpdateFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const response = await fetch(`/api/admin/cases/${caseId}/status`, {
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    if (!response.ok) {
      setMessage("状态更新失败，请稍后重试。");
      return;
    }

    setMessage("状态已更新。");
    startTransition(() => router.refresh());
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <select
        className={styles.select}
        disabled={isPending}
        onChange={(event) => setStatus(event.target.value)}
        value={status}
      >
        {caseStatuses.map((item) => (
          <option key={item} value={item}>
            {statusLabels[item as CaseStatus]}
          </option>
        ))}
      </select>
      <button className={styles.button} disabled={isPending || status === currentStatus} type="submit">
        {isPending ? "正在更新" : "更新案件状态"}
      </button>
      {message ? <p className={styles.formMessage}>{message}</p> : null}
    </form>
  );
}
