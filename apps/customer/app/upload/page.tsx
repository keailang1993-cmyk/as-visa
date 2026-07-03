"use client";

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  DocumentPreview,
  RetryUpload
} from "@as-visa/ui";
import { Bell, Camera, Check, ClipboardCheck, Home, MessageCircle, ShieldCheck, Upload, User } from "@as-visa/ui";
import { getCurrentMission } from "../lib/missionFlow";
import styles from "./upload.module.css";

type UploadState = "idle" | "preview" | "success";

export default function UploadPage() {
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
  const uploadTitle = activeMission.documentName === "护照" ? "上传护照首页" : activeMission.title;

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
      <section className={styles.phone} aria-labelledby="upload-title">
        <div className={styles.statusBar} aria-hidden="true">
          <span>9:41</span>
          <span className={styles.statusIcons}>
            <span />
            <span />
            <span />
          </span>
        </div>

        <div className={styles.header}>
          <p className={styles.brand}>AS VISA</p>
          <button aria-label="通知" className={styles.iconButton} type="button">
            <Bell size={18} strokeWidth={1.8} />
          </button>
        </div>

        <div className={styles.titleBlock}>
          <p className={styles.kicker}>今日任务</p>
          <h1 className={styles.title} id="upload-title">
            {uploadTitle}
          </h1>
          <p className={styles.description}>请确保照片清晰、四角完整、没有反光。</p>
        </div>

        {state === "idle" ? (
          <div className={styles.content}>
            <section className={styles.uploadCard} aria-label="上传要求">
              <div className={styles.uploadIcon}>
                <Upload size={28} strokeWidth={1.8} />
              </div>
              <h2>准备上传资料</h2>
              <p>按照以下要求拍摄或选择照片，我们会自动进行初步检查。</p>
              <div className={styles.checklist}>
                {["四角完整", "文字清晰可见", "无反光 / 无模糊", "有效期大于 6 个月"].map((item) => (
                  <span key={item}>
                    <Check size={14} strokeWidth={2.6} />
                    {item}
                  </span>
                ))}
              </div>
              <Button className={styles.primaryCta} onClick={() => cameraInputRef.current?.click()}>
                开始上传
              </Button>
            </section>

            <div className={styles.secondaryActions}>
              <button onClick={() => cameraInputRef.current?.click()} type="button">
                <Camera size={18} strokeWidth={1.8} />
                拍照上传
              </button>
              <button onClick={() => photoInputRef.current?.click()} type="button">
                <Upload size={18} strokeWidth={1.8} />
                从相册选择
              </button>
            </div>

            <p className={styles.trustNote}>
              <ShieldCheck size={15} strokeWidth={1.8} />
              资料仅用于签证办理，我们会加密保存。
            </p>
          </div>
        ) : null}

        {state === "preview" ? (
          <Card className={styles.previewCard}>
            <div className={styles.stack}>
              <DocumentPreview name={fileName} onRemove={handleRetry}>
                {previewUrl ? <img alt={`${activeMission.documentName}预览`} className={styles.preview} src={previewUrl} /> : null}
              </DocumentPreview>
              <div className={styles.actions}>
                <RetryUpload onRetry={handleRetry} />
                <Button onClick={handleSuccess}>使用这张照片</Button>
              </div>
            </div>
          </Card>
        ) : null}

        {state === "success" ? (
          <Card className={styles.successCard}>
            <Check size={24} />
            <h2>{activeMission.successTitle}</h2>
          </Card>
        ) : null}

        <nav className={styles.bottomNav} aria-label="主导航">
          <span className={styles.navItemActive}><Home size={19} fill="currentColor" />首页</span>
          <span className={styles.navItem}><ClipboardCheck size={19} />进度</span>
          <span className={styles.navItem}><MessageCircle size={19} />消息</span>
          <span className={styles.navItem}><User size={19} />我的</span>
        </nav>

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
