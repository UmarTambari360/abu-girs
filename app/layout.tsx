import type { Metadata } from "next";
// @ts-ignore: allow importing global CSS without type declarations
import "./globals.css";

export const metadata: Metadata = {
  title: "GIRS — Geographical Information Retriever System",
  description:
    "Search and explore campus locations at Ahmadu Bello University, Zaria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}