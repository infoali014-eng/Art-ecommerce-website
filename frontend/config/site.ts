export const siteConfig = {
  name: 'AURA | Premium Art Gallery & Custom Artwork',
  description:
    'An elegant, museum-inspired online gallery offering original paintings, calligraphy, sketches, and custom artwork commissions.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/assets/placeholders/og-image.jpg',
  links: {
    instagram: 'https://instagram.com/aura_gallery',
    pinterest: 'https://pinterest.com/aura_gallery',
    twitter: 'https://twitter.com/aura_gallery',
  },
  contact: {
    email: 'curator@auragallery.com',
    phone: '+1 (800) ART-AURA',
    address: '100 Fine Arts Blvd, Suite 400, New York, NY 10001',
    hours: 'Mon - Sat: 10:00 AM - 6:00 PM EST',
  },
} as const;
