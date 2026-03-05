import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZenFlow — Дыхательные практики и медитации",
  description: "Минималистичное приложение для медитации и дыхательных сессий",
  manifest: "/manifest.json",
  icons: { apple: "/icon-512.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ZenFlow",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
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
