import { Metadata } from 'next';

export const siteConfig = {
  name: 'AI Detector & Humanizer',
  description: 'Advanced AI content detection and humanization tool. Detect AI-generated text and humanize it with natural writing patterns.',
  url: 'https://ai-detector-humanizer.vercel.app',
  ogImage: '/og-image.png',
  twitter: {
    handle: '@aidetector',
    cardType: 'summary_large_image',
  },
  keywords: [
    'AI detector',
    'AI humanizer',
    'content detection',
    'AI writing detector',
    'humanize AI text',
    'GPT detector',
    'ChatGPT detector',
    'AI content checker',
    'text analysis',
    'content authenticity',
  ],
};

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'AI Detector Team' }],
  creator: 'AI Detector Team',
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitter.handle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};
