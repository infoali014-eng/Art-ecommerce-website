export interface Artwork {
  id: string;
  title: string;
  artist: string;
  category: 'Paintings' | 'Calligraphy' | 'Sketches';
  price: number;
  dimensions: string;
  medium: string;
  year: number;
  image: string;
  description: string;
  featured?: boolean;
  slug: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}
