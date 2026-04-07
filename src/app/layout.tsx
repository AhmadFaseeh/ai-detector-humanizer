import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "AI Detector & Humanizer - Detect and Humanize AI Content",
    template: "%s | AI Detector & Humanizer",
  },
  description:
    "Advanced AI content detection and humanization tool. Detect AI-generated text with high accuracy and humanize it using GPT-4o. Free analysis with detailed perplexity and burstiness metrics.",
  keywords: [
    "AI detector",
    "AI humanizer",
    "GPT detector",
    "ChatGPT detector",
    "AI content checker",
    "humanize AI text",
    "AI writing detector",
    "content authenticity",
    "plagiarism checker",
    "text analysis",
  ],
  authors: [{ name: "AI Detector Team" }],
  creator: "AI Detector Team",
  metadataBase: new URL("https://ai-detector-humanizer.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Detector & Humanizer - Detect and Humanize AI Content",
    description:
      "Advanced AI content detection and humanization tool. Detect AI-generated text with high accuracy and humanize it using GPT-4o.",
    url: "https://ai-detector-humanizer.vercel.app",
    siteName: "AI Detector & Humanizer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Detector & Humanizer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Detector & Humanizer - Detect and Humanize AI Content",
    description:
      "Advanced AI content detection and humanization tool. Detect AI-generated text and humanize it with GPT-4o.",
    images: ["/og-image.png"],
    creator: "@aidetector",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-gray-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
