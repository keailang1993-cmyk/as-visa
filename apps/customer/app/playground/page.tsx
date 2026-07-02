"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  AIAssistant,
  AISuggestion,
  AISummary,
  AIThinking,
  AIWarning,
  BackButton,
  BottomNavigation,
  Button,
  CameraGuide,
  Dialog,
  DocumentCard,
  DocumentPreview,
  EmptyState,
  ErrorState,
  Header,
  Loading,
  MissionCard,
  NotificationCard,
  OCRResult,
  OTPInput,
  PhoneInput,
  ProgressCard,
  SearchInput,
  SecondaryButton,
  StatusBadge,
  StepIndicator,
  SuccessState,
  TextInput,
  Textarea,
  Timeline,
  Toast,
  UploadArea,
  UploadCard,
  AICard
} from "@as-visa/ui";
import { FileText, Search, Upload, User } from "@as-visa/ui";
import styles from "./playground.module.css";

const colorTokens = [
  ["Background", "var(--noir-color-background)"],
  ["Surface", "var(--noir-color-surface)"],
  ["Raised", "var(--noir-color-surface-raised)"],
  ["Foreground", "var(--noir-color-foreground)"],
  ["Muted", "var(--noir-color-muted)"],
  ["Subtle", "var(--noir-color-subtle)"],
  ["Border", "var(--noir-color-border)"],
  ["Inverse", "var(--noir-color-inverse)"]
] as const;

const spacingTokens = ["1", "2", "3", "4", "5", "6", "8", "10", "12"] as const;
const radiusTokens = ["xs", "sm", "md", "lg", "xl", "full"] as const;
const shadowTokens = ["none", "sm", "md", "lg"] as const;
const motionTokens = ["fast", "base", "slow"] as const;

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className={styles.section} aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-")}-title`}>
      <div className={styles.sectionHeader}>
        <p className="noir-micro">NOIR</p>
        <h2 className={styles.sectionTitle} id={`${title.toLowerCase().replaceAll(" ", "-")}-title`}>
          {title}
        </h2>
        {description ? <p className="noir-description">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Showcase({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.showcase}>
      <p className="noir-micro">{label}</p>
      <div className={styles.showcaseBody}>{children}</div>
    </div>
  );
}

export default function NoirPlaygroundPage() {
  return (
    <main className={`${styles.page} noir-scope`}>
      <header className={styles.hero}>
        <p className="noir-micro">AS VISA Design System</p>
        <h1 className={styles.title}>NOIR Playground</h1>
        <p className={styles.lede}>A single source of truth for reusable components, foundations, and token behavior.</p>
      </header>

      <Section title="Foundation" description="Core tokens used by every reusable component.">
        <div className={styles.foundationGrid}>
          <Showcase label="Colors">
            <div className={styles.swatchGrid}>
              {colorTokens.map(([label, value]) => (
                <div className={styles.swatchRow} key={label}>
                  <span className={styles.swatch} style={{ "--swatch-color": value } as CSSProperties} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </Showcase>
          <Showcase label="Typography">
            <div className={styles.typeStack}>
              <p className={styles.typeDisplay}>Display</p>
              <p className={styles.typeTitle}>Title</p>
              <p className={styles.typeSubtitle}>Subtitle text for guided missions</p>
              <p className="noir-description">Caption and supporting content</p>
            </div>
          </Showcase>
          <Showcase label="Spacing">
            <div className={styles.spacingStack}>
              {spacingTokens.map((token) => <span className={styles.spacingBar} key={token} style={{ "--bar-width": `var(--noir-space-${token})` } as CSSProperties}>{token}</span>)}
            </div>
          </Showcase>
          <Showcase label="Radius">
            <div className={styles.tokenRow}>
              {radiusTokens.map((token) => <span className={styles.radiusSample} key={token} style={{ "--sample-radius": `var(--noir-radius-${token})` } as CSSProperties}>{token}</span>)}
            </div>
          </Showcase>
          <Showcase label="Shadows">
            <div className={styles.tokenRow}>
              {shadowTokens.map((token) => <span className={styles.shadowSample} key={token} style={{ "--sample-shadow": `var(--noir-shadow-${token})` } as CSSProperties}>{token}</span>)}
            </div>
          </Showcase>
          <Showcase label="Motion">
            <div className={styles.tokenRow}>
              {motionTokens.map((token) => <span className={styles.motionSample} key={token}>{token}</span>)}
            </div>
          </Showcase>
        </div>
      </Section>

      <Section title="Buttons">
        <div className={styles.componentGrid}>
          <Showcase label="Primary"><Button>Continue</Button></Showcase>
          <Showcase label="Secondary"><SecondaryButton>Review</SecondaryButton></Showcase>
          <Showcase label="Ghost"><Button variant="ghost">Skip</Button></Showcase>
          <Showcase label="Loading"><Button loading>Checking</Button></Showcase>
          <Showcase label="Disabled"><Button disabled>Disabled</Button></Showcase>
        </div>
      </Section>

      <Section title="Inputs">
        <div className={styles.formGrid}>
          <TextInput label="Input" placeholder="Applicant name" />
          <PhoneInput label="Phone" placeholder="Enter phone number" />
          <OTPInput label="OTP" value="123" />
          <Textarea label="Textarea" placeholder="Notes for the case" />
          <SearchInput label="Search" placeholder="Search documents" />
        </div>
      </Section>

      <Section title="Cards">
        <div className={styles.componentGrid}>
          <MissionCard title="Mission Card" description="One clear action for the applicant." />
          <UploadCard title="Upload Card" description="Collect a required document." />
          <AICard title="AI Card" description="Guidance from the assistant surface." />
          <ProgressCard title="Progress Card" description="Current case progress." value={64} />
          <DocumentCard title="Document Card" description="Passport bio page." />
          <NotificationCard title="Notification Card" description="A calm system message." />
        </div>
      </Section>

      <Section title="Upload">
        <div className={styles.componentGrid}>
          <UploadArea title="Upload Area" description="Drag a file or choose from device." action={<Button icon={<Upload size={16} />}>Choose file</Button>} />
          <CameraGuide title="Camera Guide" description="Keep all document corners visible." />
          <DocumentPreview name="passport.pdf" />
          <OCRResult title="OCR Result" fields={[{ label: "Applicant", value: "Verified" }, { label: "Document", value: "Passport" }]} />
        </div>
      </Section>

      <Section title="Progress">
        <div className={styles.componentGrid}>
          <Showcase label="Timeline"><Timeline steps={[{ id: "1", label: "Identity", status: "complete" }, { id: "2", label: "Documents", status: "active" }]} /></Showcase>
          <Showcase label="Step Indicator"><StepIndicator current={2} total={5} /></Showcase>
          <Showcase label="Status Badge"><StatusBadge status="active" /></Showcase>
        </div>
      </Section>

      <Section title="AI">
        <div className={styles.componentGrid}>
          <AIAssistant title="Assistant" description="Guides the next mission." />
          <AISuggestion title="Suggestion" description="Confirm travel dates before upload." />
          <AISummary title="Summary" description="Identity documents are ready." />
          <Showcase label="Thinking"><AIThinking /></Showcase>
          <AIWarning title="Warning" description="This document may need review." />
        </div>
      </Section>

      <Section title="Feedback">
        <div className={styles.componentGrid}>
          <Showcase label="Loading"><Loading /></Showcase>
          <EmptyState title="Empty" description="No documents yet." />
          <SuccessState title="Success" description="Progress saved." />
          <ErrorState title="Error" description="Something needs attention." />
          <Toast title="Toast" description="Document uploaded." />
          <Dialog open inline title="Dialog">Reusable confirmation surface.</Dialog>
        </div>
      </Section>

      <Section title="Navigation">
        <div className={styles.navigationGrid}>
          <Header title="Header" leading={<BackButton />} trailing={<Button icon={<Search size={16} />} variant="ghost">Search</Button>} />
          <Showcase label="Back Button"><BackButton /></Showcase>
          <BottomNavigation inline items={[{ id: "mission", label: "Mission", icon: <FileText size={16} />, active: true }, { id: "profile", label: "Profile", icon: <User size={16} /> }]} />
        </div>
      </Section>
    </main>
  );
}
