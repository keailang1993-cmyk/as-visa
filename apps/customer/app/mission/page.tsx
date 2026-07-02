"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@as-visa/ui";
import { getCurrentMission } from "../lib/missionFlow";
import styles from "./mission.module.css";

export default function MissionPage() {
  const router = useRouter();
  const [currentMission, setCurrentMission] = useState(getCurrentMission);

  useEffect(() => {
    setCurrentMission(getCurrentMission());
  }, []);

  return (
    <main className={`${styles.page} noir-scope`}>
      <Card className={styles.card}>
        <section className={styles.mission} aria-labelledby="mission-title">
          <p className="noir-micro">{currentMission.isComplete ? "资料提交完成" : "今日任务"}</p>
          <h1 className={styles.title} id="mission-title">
            {currentMission.isComplete ? "资料提交完成" : currentMission.mission.title}
          </h1>
          {currentMission.isComplete ? (
            <p className={styles.estimate}>所有必要资料已经提交完成。</p>
          ) : (
            <>
              <p className={styles.estimate}>预计 30 秒完成</p>
              <Button className={styles.cta} onClick={() => router.push("/upload")}>
                开始上传
              </Button>
            </>
          )}
        </section>
      </Card>
    </main>
  );
}
