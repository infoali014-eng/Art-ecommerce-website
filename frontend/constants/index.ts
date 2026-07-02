export const CATEGORY = {
  PAINTINGS: 'Paintings',
  CALLIGRAPHY: 'Calligraphy',
  SKETCHES: 'Sketches',
} as const;

export type CategoryType = (typeof CATEGORY)[keyof typeof CATEGORY];

export const CATEGORY_DETAILS = {
  [CATEGORY.PAINTINGS]: {
    name: 'Paintings',
    slug: 'paintings',
    description: 'Bespoke original oil and acrylic paintings capturing timeless narratives.',
    path: '/gallery/paintings',
  },
  [CATEGORY.CALLIGRAPHY]: {
    name: 'Calligraphy',
    slug: 'calligraphy',
    description:
      'Exquisite handwritten scripts combining historical elegance with contemporary vision.',
    path: '/gallery/calligraphy',
  },
  [CATEGORY.SKETCHES]: {
    name: 'Sketches',
    slug: 'sketches',
    description: 'Fine graphite and charcoal sketches portraying deep structural forms and light.',
    path: '/gallery/sketches',
  },
} as const;
