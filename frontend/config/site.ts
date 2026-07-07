export const siteConfig = {
  name: 'Manan Art Gallery',
  description:
    'An elegant online gallery offering original paintings, calligraphy, sketches, and custom artwork commissions in Pakistan.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/assets/placeholders/og-image.jpg',
  links: {
    instagram: 'https://instagram.com/manan_art_gallery',
    pinterest: 'https://pinterest.com/manan_art_gallery',
    twitter: 'https://twitter.com/manan_art',
  },
  contact: {
    email: 'infoali014@gmail.com',
    phone: '+92 325 2538104',
    address: 'Lahore, Pakistan',
    hours: 'Mon - Sat: 10:00 AM - 10:00 PM PKT',
  },
} as const;
