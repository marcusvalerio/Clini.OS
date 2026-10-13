import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Clini.OS — Gestão de cuidado",
    template: "%s | Clini.OS"
  },
  description:
    "Gestão integrada de beneficiários, documentos, atendimentos e agenda para organizações sociais."
};

export const viewport: Viewport = {
  themeColor: "#F7F8F5",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
