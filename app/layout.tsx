import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


import { QueryProvider } from "@/providers";
import { ThemeScript } from "@/components/layout/ThemeScript";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Curator",
  description: "A high-end gallery for technical knowledge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}