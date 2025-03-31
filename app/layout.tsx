import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flexume",
  description:
    "채용공고에 맞춘 이력서를 쉽게 만들고, 자유롭게 구성하고, PDF로 깔끔하게 제출하세요.",
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
