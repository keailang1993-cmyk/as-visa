"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

const supplementDocumentOptions = [
  { id: "passport", name: "Passport" },
  { id: "idCard", name: "ID Card" },
  { id: "bankStatement", name: "Bank Statement" },
  { id: "photo", name: "Photo" },
  { id: "other", name: "Others" }
] as const;

type SupplementRequestFormProps = {
  caseId: string;
};

export function SupplementRequestForm({ caseId }: SupplementRequestFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [formMessage, setFormMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function toggleDocument(documentId: string) {
    setSelectedDocuments((current) => (
      current.includes(documentId)
        ? current.filter((item) => item !== documentId)
        : [...current, documentId]
    ));
  }

  function closeModal() {
    if (isPending) return;
    setIsOpen(false);
    setFormMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");

    if (selectedDocuments.length === 0) {
      setFormMessage("请至少选择一项需要补充的资料。");
      return;
    }

    if (!message.trim()) {
      setFormMessage("请填写补件说明。");
      return;
    }

    const response = await fetch(`/api/admin/cases/${caseId}/supplement-request`, {
      body: JSON.stringify({
        message: message.trim(),
        requestedDocuments: selectedDocuments
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    if (!response.ok) {
      setFormMessage("补件请求创建失败，请稍后重试。");
      return;
    }

    setFormMessage("补件请求已发送。");
    setMessage("");
    setSelectedDocuments([]);
    setIsOpen(false);
    startTransition(() => router.refresh());
  }

  return (
    <>
      <button className={styles.secondaryButton} onClick={() => setIsOpen(true)} type="button">
        Request Supplement
      </button>

      {isOpen ? (
        <div className={styles.modalOverlay} role="presentation">
          <form className={styles.modalCard} onSubmit={handleSubmit}>
            <div>
              <span className={styles.label}>Supplement</span>
              <h2>Request Supplement</h2>
              <p className={styles.muted}>选择客户需要补充的资料，并写明补件要求。</p>
            </div>

            <div className={styles.checkboxGrid}>
              {supplementDocumentOptions.map((item) => (
                <label className={styles.checkboxItem} key={item.id}>
                  <input
                    checked={selectedDocuments.includes(item.id)}
                    onChange={() => toggleDocument(item.id)}
                    type="checkbox"
                  />
                  <span>{item.name}</span>
                </label>
              ))}
            </div>

            <label className={styles.modalField}>
              <span>Supplement message</span>
              <textarea
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Please upload the latest 6-month bank statement."
                value={message}
              />
            </label>

            {formMessage ? <p className={styles.formMessage}>{formMessage}</p> : null}

            <div className={styles.modalActions}>
              <button className={styles.secondaryButton} disabled={isPending} onClick={closeModal} type="button">
                Cancel
              </button>
              <button className={styles.button} disabled={isPending} type="submit">
                {isPending ? "Submitting" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
