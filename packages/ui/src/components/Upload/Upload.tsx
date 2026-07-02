import type { HTMLAttributes, ReactNode } from "react";
import { Camera, FileText, Upload as UploadIcon, X } from "../../icons";
import type { QueueItem } from "../../types";
import { Button } from "../Button";
import { Card } from "../Cards";

export interface UploadAreaProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function UploadArea({ title, description, action, ...props }: UploadAreaProps) {
  return (
    <div className="noir-upload-area" {...props}>
      <UploadIcon size={24} />
      <div className="noir-stack">
        <h3 className="noir-title">{title}</h3>
        {description ? <p className="noir-description">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function UploadQueue({ items }: { items: QueueItem[] }) {
  return (
    <div className="noir-stack">
      {items.map((item) => (
        <Card key={item.id}>
          <div className="noir-between">
            <div className="noir-row">
              <FileText size={18} />
              <div>
                <h3 className="noir-title">{item.name}</h3>
                <p className="noir-description">{item.status ?? "idle"}</p>
              </div>
            </div>
            <span className="noir-badge">{item.progress ?? 0}%</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function CameraGuide({ title, description }: { title: string; description?: string }) {
  return (
    <Card>
      <div className="noir-row">
        <Camera size={20} />
        <div>
          <h3 className="noir-title">{title}</h3>
          {description ? <p className="noir-description">{description}</p> : null}
        </div>
      </div>
    </Card>
  );
}

export function DocumentPreview({
  children,
  name,
  onRemove,
  removeLabel = "移除"
}: {
  children?: ReactNode;
  name: string;
  onRemove?: () => void;
  removeLabel?: string;
}) {
  return (
    <Card>
      <div className="noir-between">
        <div className="noir-row">
          <FileText size={18} />
          <h3 className="noir-title">{name}</h3>
        </div>
        {onRemove ? (
          <Button icon={<X size={16} />} onClick={onRemove} variant="ghost">
            {removeLabel}
          </Button>
        ) : null}
      </div>
      {children}
    </Card>
  );
}

export function OCRResult({ title, fields }: { title: string; fields: Array<{ label: string; value: string }> }) {
  return (
    <Card>
      <div className="noir-stack">
        <h3 className="noir-title">{title}</h3>
        {fields.map((field) => (
          <div className="noir-between" key={field.label}>
            <span className="noir-description">{field.label}</span>
            <span>{field.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function RetryUpload({ label = "重新上传", onRetry }: { label?: string; onRetry?: () => void }) {
  return <Button onClick={onRetry} variant="secondary">{label}</Button>;
}
