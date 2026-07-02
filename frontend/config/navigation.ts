export interface NavItem {
  label: string;
  href: string;
  items?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Gallery',
    href: '/gallery',
    items: [
      { label: 'Paintings', href: '/gallery/paintings' },
      { label: 'Calligraphy', href: '/gallery/calligraphy' },
      { label: 'Sketches', href: '/gallery/sketches' },
      { label: 'Featured Collection', href: '/collections' },
      { label: 'New Arrivals', href: '/gallery?filter=new' },
    ],
  },
  {
    label: 'Collections',
    href: '/collections',
  },
  {
    label: 'Custom Artwork',
    href: '/custom-order',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];
