import type { ReactNode } from "react";

export type NoirSize = "sm" | "md" | "lg";
export type NoirTone = "neutral" | "success" | "warning" | "danger";
export type NoirStatus = "idle" | "active" | "complete" | "blocked";

export interface Option {
  label: string;
  value: string;
}

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  status?: NoirStatus;
}

export interface QueueItem {
  id: string;
  name: string;
  status?: NoirStatus | "uploading" | "error";
  progress?: number;
}

export interface ComponentWithChildren {
  children?: ReactNode;
}
