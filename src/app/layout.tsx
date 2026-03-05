import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZenFlow — Дыхательные практики и медитации",
  description: "Минималистичное приложение для медитации и дыхательных сессий",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
