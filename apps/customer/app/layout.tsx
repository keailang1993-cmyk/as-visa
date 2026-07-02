import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../../../packages/ui/src/styles.css";
import "./styles.css";

export const metadata: Metadata = {
  title: "AS VISA",
  description: "AI-first visa delivery platform"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
