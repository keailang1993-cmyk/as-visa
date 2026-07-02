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
          <p className="noir-micro">{currentMission.isComplete ? "Mission Completed" : "Today's Mission"}</p>
          <h1 className={styles.title} id="mission-title">
            {currentMission.isComplete ? "Mission Completed" : currentMission.mission.title}
          </h1>
          {currentMission.isComplete ? (
            <p className={styles.estimate}>All required document missions are complete.</p>
          ) : (
            <>
              <p className={styles.estimate}>Estimated 30 seconds.</p>
              <Button className={styles.cta} onClick={() => router.push("/upload-passport")}>
                Start
              </Button>
            </>
          )}
        </section>
      </Card>
    </main>
  );
}
