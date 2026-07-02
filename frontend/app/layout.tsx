import { Cormorant_Garamond, Inter } from 'next/font/google';

import { siteConfig } from '@/config/site';

import type { Metadata, Viewport } from 'next';

import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | AURA`,
  },
  description: siteConfig.description,
  keywords: [
    'art gallery',
    'original paintings',
    'calligraphy',
    'pencil sketches',
    'custom artwork',
    'luxury art',
    'museum quality',
    'fine art',
  ],
  authors: [{ name: 'AURA Gallery' }],
  creator: 'AURA Gallery',
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: 'AURA Gallery',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'AURA Premium Art Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
};

import { WishlistProvider } from '@/context/WishlistContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-primary font-sans">
        <WishlistProvider>{children}</WishlistProvider>
      </body>
    </html>
  );
}
