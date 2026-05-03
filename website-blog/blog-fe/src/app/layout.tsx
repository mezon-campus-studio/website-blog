import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


import { QueryProvider, AuthProvider } from "@/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Memorizz",
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
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <main className="w-full">{children}</main>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}