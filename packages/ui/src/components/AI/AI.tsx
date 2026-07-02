import type { ReactNode } from "react";
import { AlertCircle, Bot, LoaderCircle } from "../../icons";
import { Card } from "../Cards";

interface AIBlockProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

function AIBlock({ title, description, children }: AIBlockProps) {
  return (
    <Card>
      <div className="noir-stack">
        <div className="noir-row">
          <Bot size={18} />
          <h3 className="noir-title">{title}</h3>
        </div>
        {description ? <p className="noir-description">{description}</p> : null}
        {children}
      </div>
    </Card>
  );
}

export function AIAssistant(props: AIBlockProps) { return <AIBlock {...props} />; }
export function AITip(props: AIBlockProps) { return <AIBlock {...props} />; }
export function AISuggestion(props: AIBlockProps) { return <AIBlock {...props} />; }
export function AISummary(props: AIBlockProps) { return <AIBlock {...props} />; }

export function AIWarning({ title, description, children }: AIBlockProps) {
  return (
    <Card>
      <div className="noir-stack">
        <div className="noir-row">
          <AlertCircle size={18} />
          <h3 className="noir-title">{title}</h3>
        </div>
        {description ? <p className="noir-description">{description}</p> : null}
        {children}
      </div>
    </Card>
  );
}

export function AIThinking({ label = "Thinking" }: { label?: string }) {
  return (
    <div className="noir-row">
      <LoaderCircle className="noir-spinner" size={16} />
      <span className="noir-description">{label}</span>
    </div>
  );
}
