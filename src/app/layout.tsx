import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Clini.OS — Gestão de cuidado", template: "%s | Clini.OS" },
  description: "Gestão integrada de beneficiários, acompanhamento profissional e rotinas administrativas para organizações sociais."
};

export const viewport: Viewport = {
  themeColor: "#F7F8F5",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
