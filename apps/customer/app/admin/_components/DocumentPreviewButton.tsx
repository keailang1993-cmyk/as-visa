"use client";

import { useState } from "react";
import styles from "../admin.module.css";

type DocumentPreviewButtonProps = {
  documentId: string;
};

export function DocumentPreviewButton({ documentId }: DocumentPreviewButtonProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handlePreview() {
    setError("");
    setIsLoading(true);
    const previewWindow = window.open("", "_blank", "noopener,noreferrer");

    try {
      const response = await fetch(`/api/admin/documents/${documentId}/signed-url`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error("Failed to create signed URL");
      }

      const data = (await response.json()) as { signedUrl?: string };

      if (!data.signedUrl) {
        throw new Error("Missing signed URL");
      }

      if (previewWindow) {
        previewWindow.location.href = data.signedUrl;
      } else {
        window.location.href = data.signedUrl;
      }
    } catch {
      previewWindow?.close();
      setError("文件暂时无法打开，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.previewAction}>
      <button className={styles.secondaryButton} disabled={isLoading} onClick={handlePreview} type="button">
        {isLoading ? "正在打开" : "查看文件"}
      </button>
      {error ? <p className={styles.formMessage}>{error}</p> : null}
    </div>
  );
}
