import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home Base Dashboard",
  description: "An ADHD-friendly life management dashboard for habits, reminders, tasks, and daily home organization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
