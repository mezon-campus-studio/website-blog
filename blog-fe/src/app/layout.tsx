import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');

    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored);
      return;
    }

    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();
`;

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
      <body className={inter.className}>
        <template
          dangerouslySetInnerHTML={{ __html: `<script>${themeScript}</script>` }}
        />

        <Navbar />

        <main>{children}</main>
      </body>
    </html>
  );
}