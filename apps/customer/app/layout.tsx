import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../../../packages/ui/src/styles.css";
import "./styles.css";

export const metadata: Metadata = {
  title: "AS VISA",
  description: "AI 签证办理服务平台"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
