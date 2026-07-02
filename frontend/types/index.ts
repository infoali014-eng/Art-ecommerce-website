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

export interface CartItem {
  id: string; // Unique combination of artworkId + frameOption
  artworkId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  frameOption: string; // e.g. "none" | "black" | "walnut" | "gold" | "white"
  notes?: string;
  addedAt: string;
}

export interface WishlistItem {
  id: string; // Matches artworkId
  artworkId: string;
  addedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}
