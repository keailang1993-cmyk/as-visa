import type { ReactNode } from "react";
import { AlertCircle, Check, LoaderCircle } from "../../icons";
import { Button } from "../Button";
import { Card } from "../Cards";

export function Loading({ label = "Loading" }: { label?: string }) {
  return <div className="noir-row"><LoaderCircle className="noir-spinner" size={16} /><span className="noir-description">{label}</span></div>;
}

export function Skeleton({ label }: { label?: string }) {
  return <div aria-label={label} className="noir-skeleton" />;
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <Card><div className="noir-stack"><h3 className="noir-title">{title}</h3>{description ? <p className="noir-description">{description}</p> : null}{action}</div></Card>;
}

export function ErrorState({ title, description, onRetry }: { title: string; description?: string; onRetry?: () => void }) {
  return <Card><div className="noir-stack"><AlertCircle size={20} /><h3 className="noir-title">{title}</h3>{description ? <p className="noir-description">{description}</p> : null}{onRetry ? <Button onClick={onRetry} variant="secondary">Retry</Button> : null}</div></Card>;
}

export function SuccessState({ title, description }: { title: string; description?: string }) {
  return <Card><div className="noir-stack"><Check size={20} /><h3 className="noir-title">{title}</h3>{description ? <p className="noir-description">{description}</p> : null}</div></Card>;
}

export function Toast({ title, description }: { title: string; description?: string }) {
  return <div className="noir-toast" role="status"><h3 className="noir-title">{title}</h3>{description ? <p className="noir-description">{description}</p> : null}</div>;
}

export function Dialog({ open, title, children, action, inline = false }: { open: boolean; title: string; children?: ReactNode; action?: ReactNode; inline?: boolean }) {
  if (!open) return null;
  return <>{inline ? null : <div className="noir-overlay" />}<div aria-modal={inline ? undefined : true} className={inline ? "noir-dialog noir-dialog-inline" : "noir-dialog"} role="dialog"><div className="noir-stack"><h2 className="noir-title">{title}</h2>{children}{action}</div></div></>;
}

export function BottomSheet({ open, title, children }: { open: boolean; title: string; children?: ReactNode }) {
  if (!open) return null;
  return <><div className="noir-overlay" /><div className="noir-bottom-sheet" role="dialog"><div className="noir-stack"><h2 className="noir-title">{title}</h2>{children}</div></div></>;
}
