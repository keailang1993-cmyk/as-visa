import type { ReactNode } from "react";
import { Card } from "../Cards";

export function QuestionCard({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return <Card><div className="noir-stack"><h3 className="noir-title">{title}</h3>{description ? <p className="noir-description">{description}</p> : null}{children}</div></Card>;
}
