import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CSPostHogProvider } from "./providers";
import "./globals.css";
import { FaviconAnimator } from "@/components/FaviconAnimator";
import { Suspense } from "react";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Asymmetric | The Venture Studio for Creators",
    template: "%s | Asymmetric"
  },
  description: "We build the software. You build the empire. High-leverage technical infrastructure for the world's top creators.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Asymmetric | Venture Studio",
    description: "We build the software. You build the empire.",
    url: "https://asymmetric.dev",
    siteName: "Asymmetric",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASYMMETRIC.",
    description: "The silent infrastructure behind your loudest wins.",
    creator: "@asymmetric_ai",
  },
  robots: {
    index: true,
    follow: true,
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >


        <AuthProvider>
          <FaviconAnimator />
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <CSPostHogProvider>{children}</CSPostHogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
