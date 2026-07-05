/* eslint-disable */
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
  role: 'customer' | 'admin';
  adminRole?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  maintenanceMode: boolean;
  heroTitle: string;
  heroSubtitle: string;
}

export interface Order {
  id: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState?: string;
  shippingZip: string;
  shippingCountry: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  trackingNumber?: string;
  paymentProvider?: string;
  paymentIntentId?: string;
  transactionId?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: string;
  artworkId?: string;
  title: string;
  price: number;
  quantity: number;
  frameOption: string;
  createdAt: string;
}

export interface AdminActivity {
  id: number;
  adminId: string | null;
  adminName: string;
  action: string;
  target: string;
  previousValue?: any;
  newValue?: any;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export type CommissionStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Quotation Sent'
  | 'Waiting For Approval'
  | 'Approved'
  | 'Rejected'
  | 'In Progress'
  | 'Preview Ready'
  | 'Revision Requested'
  | 'Final Review'
  | 'Completed'
  | 'Delivered'
  | 'Cancelled';

export interface Commission {
  id: string;
  userId: string;
  title: string;
  artworkType: string;
  description: string;
  specialInstructions?: string;
  customerBudget: number;
  quotedPrice?: number;
  width?: number;
  height?: number;
  sizeUnit: string;
  orientation?: string;
  frameOption?: string;
  preferredStyle?: string;
  preferredColors?: string[];
  artworkPurpose?: string;
  deadline?: string;
  status: CommissionStatus;
  paymentStatus: string;
  assignedArtistId?: string;
  estimatedCompletion?: string;
  adminNotes?: string;
  internalNotes?: string;
  quotationNotes?: string;
  priority: string;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
  referenceImages?: CommissionReference[];
  updates?: CommissionUpdate[];
}

export interface CommissionReference {
  id: number;
  commissionId: string;
  imageUrl: string;
  displayOrder: number;
  createdAt: string;
}

export interface CommissionUpdate {
  id: number;
  commissionId: string;
  oldStatus?: string;
  newStatus: string;
  message?: string;
  createdBy?: string;
  createdAt: string;
}

export interface CommissionDraft {
  id?: string;
  artworkType?: string;
  title?: string;
  description?: string;
  specialInstructions?: string;
  customerBudget?: number;
  deadline?: string;
  width?: number;
  height?: number;
  sizeUnit?: string;
  orientation?: string;
  frameOption?: string;
  preferredStyle?: string;
  preferredColors?: string[];
  artworkPurpose?: string;
  medium?: string; // Step 4 specification selection
}
