import type { CSSProperties, ReactNode } from "react";
import { Check, Clock } from "../../icons";
import type { NoirStatus, StepItem } from "../../types";
import { Card } from "../Cards";

export function StatusBadge({ status = "idle" }: { status?: NoirStatus }) {
  const labels: Record<NoirStatus, string> = {
    active: "进行中",
    blocked: "需处理",
    complete: "已完成",
    idle: "未开始"
  };

  return <span className="noir-badge">{labels[status]}</span>;
}

export function Timeline({ steps }: { steps: StepItem[] }) {
  return (
    <div className="noir-stack">
      {steps.map((step) => (
        <div className="noir-row" key={step.id}>
          {step.status === "complete" ? <Check size={16} /> : <Clock size={16} />}
          <div>
            <h3 className="noir-title">{step.label}</h3>
            {step.description ? <p className="noir-description">{step.description}</p> : null}
          </div>
          <StatusBadge status={step.status} />
        </div>
      ))}
    </div>
  );
}

export function MissionProgress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="noir-stack">
      {label ? <p className="noir-description">{label}</p> : null}
      <div className="noir-progress-track">
        <div className="noir-progress-fill" style={{ "--noir-progress": `${value}%` } as CSSProperties} />
      </div>
    </div>
  );
}

export function StepIndicator({ current, total }: { current: number; total: number }) {
  return <span className="noir-badge">第 {current} 步 / 共 {total} 步</span>;
}

export function CompletionCard({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <Card>
      <div className="noir-stack">
        <Check size={20} />
        <h3 className="noir-title">{title}</h3>
        {description ? <p className="noir-description">{description}</p> : null}
        {action}
      </div>
    </Card>
  );
}
