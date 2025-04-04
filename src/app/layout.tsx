import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'sweetalert2/src/sweetalert2.scss'
import NProgress from "./components/Progress";
import { Suspense } from 'react';
import ErrorBoundary from "./components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codium - Code Playground",
  description: "Interactive coding environment with multiple language support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center">
              <div className="animate-pulse text-2xl">Loading...</div>
            </div>
          }>
            <NProgress />
            {children}
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  );
}