import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FloodGuard AI",
  description: "Predict floods before the street submerges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body
        className={`${inter.className} ${geistMono.variable} antialiased dark:bg-black dark:text-neutral-50 selection:bg-cyan-500/30 selection:text-white`}
      >
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
