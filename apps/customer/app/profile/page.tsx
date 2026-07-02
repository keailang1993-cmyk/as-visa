"use client";

import {
  Avatar,
  Card,
  MissionProgress,
  ProfileCard,
  StatusBadge
} from "@as-visa/ui";
import styles from "./profile.module.css";

const profile = {
  name: "签证申请人",
  visaProduct: "旅游签证",
  phone: "已验证手机号",
  progress: 72
};

export default function ProfilePage() {
  return (
    <main className={`${styles.page} noir-scope`}>
      <section className={styles.shell} aria-labelledby="profile-title">
        <Card className={styles.hero}>
          <div className={styles.identity}>
            <Avatar name={profile.name} size="lg" />
            <div className={styles.identityText}>
              <p className="noir-micro">个人资料</p>
              <h1 className={styles.title} id="profile-title">
                {profile.name}
              </h1>
            </div>
          </div>
        </Card>

        <div className={styles.grid}>
          <ProfileCard title="签证产品" description={profile.visaProduct} />
          <ProfileCard title="手机号" description={profile.phone} />
          <Card>
            <div className="noir-stack">
              <div className="noir-between">
                <div>
                  <p className="noir-micro">当前进度</p>
                  <h2 className="noir-title">顾问审核中</h2>
                </div>
                <StatusBadge status="active" />
              </div>
              <MissionProgress value={profile.progress} label={`已完成 ${profile.progress}%`} />
            </div>
          </Card>
          <ProfileCard title="客服支持" description="如资料有疑问，您的顾问会协助处理。" />
          <ProfileCard title="设置" description="通知和账户偏好设置。" />
        </div>
      </section>
    </main>
  );
}
