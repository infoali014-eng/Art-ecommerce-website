export interface Artwork {
  id: string;
  slug: string;
  title: string;
  artist: string;
  artistId: string;
  description: string;
  story: string;
  technique: string;
  price: number;
  category: 'paintings' | 'calligraphy' | 'sketches';
  medium: string;
  dimensions: string;
  orientation: 'portrait' | 'landscape' | 'square';
  availability: 'available' | 'sold' | 'reserved';
  featured: boolean;
  popular: boolean;
  newArrival: boolean;
  isOriginal: boolean;
  framingAvailable: boolean;
  estimatedDelivery: string;
  tags: string[];
  images: string[];
  collection?: string;
  year: number;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  bio: string;
  avatar: string;
  mediums: string[];
  statement: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  curatorNote?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

// Commerce engine cart item details (Phase 3 ready)
export interface CartItem {
  artworkId: string;
  quantity: number;
  frameOption: boolean;
  price: number;
}
