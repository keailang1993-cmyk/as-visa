import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { AlertCircle, Bot, Check, FileText, Upload, User } from "../../icons";
import type { NoirTone } from "../../types";
import { cn } from "../../utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive = false, className, ...props }: CardProps) {
  return <div className={cn("noir-card", interactive && "noir-card-interactive", className)} {...props} />;
}

interface TitledCardProps extends CardProps {
  title: string;
  description?: string;
  meta?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

function TitledCard({ title, description, meta, action, icon, children, ...props }: TitledCardProps) {
  return (
    <Card {...props}>
      <div className="noir-stack">
        <div className="noir-between">
          <div className="noir-row">
            {icon}
            <div>
              {meta ? <p className="noir-micro">{meta}</p> : null}
              <h3 className="noir-title">{title}</h3>
            </div>
          </div>
          {action}
        </div>
        {description ? <p className="noir-description">{description}</p> : null}
        {children}
      </div>
    </Card>
  );
}

export function MissionCard(props: TitledCardProps) {
  return <TitledCard icon={props.icon ?? <Check size={18} />} interactive {...props} />;
}

export function UploadCard(props: TitledCardProps) {
  return <TitledCard icon={props.icon ?? <Upload size={18} />} {...props} />;
}

export function AICard(props: TitledCardProps) {
  return <TitledCard icon={props.icon ?? <Bot size={18} />} {...props} />;
}

export interface ProgressCardProps extends TitledCardProps {
  value?: number;
}

export function ProgressCard({ value = 0, children, ...props }: ProgressCardProps) {
  return (
    <TitledCard {...props}>
      <div className="noir-progress-track">
        <div className="noir-progress-fill" style={{ "--noir-progress": `${value}%` } as CSSProperties} />
      </div>
      {children}
    </TitledCard>
  );
}

export function DocumentCard(props: TitledCardProps) {
  return <TitledCard icon={props.icon ?? <FileText size={18} />} {...props} />;
}

export function NotificationCard(props: TitledCardProps) {
  return <TitledCard icon={props.icon ?? <AlertCircle size={18} />} {...props} />;
}

export interface StatusCardProps extends TitledCardProps {
  tone?: NoirTone;
}

export function StatusCard({ tone = "neutral", className, ...props }: StatusCardProps) {
  return <TitledCard className={cn(`noir-tone-${tone}`, className)} icon={props.icon ?? <Check size={18} />} {...props} />;
}

export function ProfileCard(props: TitledCardProps) {
  return <TitledCard icon={props.icon ?? <User size={18} />} {...props} />;
}
