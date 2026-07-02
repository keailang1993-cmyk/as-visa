"use client";

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  CameraGuide,
  Card,
  DocumentPreview,
  RetryUpload,
  SuccessState,
  UploadArea
} from "@as-visa/ui";
import { Camera, Upload } from "@as-visa/ui";
import { getCurrentMission } from "../lib/missionFlow";
import styles from "./upload-passport.module.css";

type UploadState = "idle" | "preview" | "success";

export default function UploadPassportPage() {
  const router = useRouter();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [currentMission] = useState(getCurrentMission);
  const [state, setState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (currentMission.isComplete) {
      router.replace("/completion");
    }
  }, [currentMission.isComplete, router]);

  if (currentMission.isComplete || !currentMission.mission) return null;

  const activeMission = currentMission.mission;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setState("preview");
  }

  function handleRetry() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFileName("");
    setPreviewUrl("");
    setState("idle");

    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function handleSuccess() {
    setState("success");
    window.setTimeout(() => {
      router.push("/ai-review");
    }, 650);
  }

  return (
    <main className={`${styles.page} noir-scope`}>
      <section className={styles.shell} aria-labelledby="upload-title">
        <div className={styles.header}>
          <p className="noir-micro">Today's Mission</p>
          <h1 className={styles.title} id="upload-title">
            {activeMission.title}
          </h1>
          <p className="noir-description">{activeMission.uploadDescription}</p>
        </div>

        {state === "idle" ? (
          <div className={styles.stack}>
            <UploadArea
              title={activeMission.uploadTitle}
              description="Make sure the full document is visible."
              action={
                <div className={styles.actions}>
                  <Button icon={<Camera size={16} />} onClick={() => cameraInputRef.current?.click()} variant="secondary">
                    Camera
                  </Button>
                  <Button icon={<Upload size={16} />} onClick={() => photoInputRef.current?.click()}>
                    Photo Upload
                  </Button>
                </div>
              }
            />
            <CameraGuide title="Camera Guide" description={activeMission.guide} />
          </div>
        ) : null}

        {state === "preview" ? (
          <Card>
            <div className={styles.stack}>
              <DocumentPreview name={fileName} onRemove={handleRetry}>
                {previewUrl ? <img alt={`${activeMission.title} preview`} className={styles.preview} src={previewUrl} /> : null}
              </DocumentPreview>
              <div className={styles.actions}>
                <RetryUpload onRetry={handleRetry} />
                <Button onClick={handleSuccess}>Use this photo</Button>
              </div>
            </div>
          </Card>
        ) : null}

        {state === "success" ? (
          <SuccessState title={activeMission.successTitle} description="Preparing AI review." />
        ) : null}

        <input
          accept="image/*"
          capture="environment"
          className={styles.hiddenInput}
          onChange={handleFileChange}
          ref={cameraInputRef}
          type="file"
        />
        <input
          accept="image/*,.pdf"
          className={styles.hiddenInput}
          onChange={handleFileChange}
          ref={photoInputRef}
          type="file"
        />
      </section>
    </main>
  );
}
