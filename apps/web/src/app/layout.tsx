import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jiva",
  description:
    "Jiva is an application aimed at making coal mine operations safer and more productive",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
