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
  name: "AS VISA Applicant",
  visaProduct: "Visitor Visa",
  phone: "Verified phone number",
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
              <p className="noir-micro">User Profile</p>
              <h1 className={styles.title} id="profile-title">
                {profile.name}
              </h1>
            </div>
          </div>
        </Card>

        <div className={styles.grid}>
          <ProfileCard title="Visa Product" description={profile.visaProduct} />
          <ProfileCard title="Phone" description={profile.phone} />
          <Card>
            <div className="noir-stack">
              <div className="noir-between">
                <div>
                  <p className="noir-micro">Current Progress</p>
                  <h2 className="noir-title">Advisor Review</h2>
                </div>
                <StatusBadge status="active" />
              </div>
              <MissionProgress value={profile.progress} label={`${profile.progress}% complete`} />
            </div>
          </Card>
          <ProfileCard title="Support" description="Your advisor is available for document questions." />
          <ProfileCard title="Settings" description="Notification and account preferences." />
        </div>
      </section>
    </main>
  );
}
