
export interface ProductImage {
  url: string;
  dataAiHint?: string;
}

export interface ProductVariant {
  weight: string; // e.g., "100g", "250g", "500ml"
  price: number;
  pricePerUnit?: string; // e.g., "(₹5.99 / 100g)" - Calculated
  sku?: string; // Optional Stock Keeping Unit for the variant
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  images: ProductImage[];
  category?: string;
  variants: ProductVariant[];
  defaultVariantIndex: number; // Index of the default variant in the 'variants' array
}

export interface CartItem {
  id: string; // Corresponds to Product.id
  variantSku?: string; // Optional: If variants have SKUs, store it
  name: string;
  price: number; // Price of the specific variant added
  quantity: number;
  imageUrl: string;
  weight: string; // Weight of the specific variant added
  dataAiHint?: string; // from product image
  originalRetailPrice?: number; // Store original retail price if needed for dynamic adjustments
}

export interface ShippingAddress {
  id?: string;
  label?: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface StatusHistoryEntry {
  status: Order['status'];
  timestamp: Date;
  notes?: string;
}

export interface OrderFeedback {
  orderId: string;
  userId?: string;
  rating: number; // 1-5
  comment: string;
  isComplaint: boolean;
  submittedAt: Date;
}

export interface Order {
  id: string;
  userId?: string;
  customerInfo: ShippingAddress;
  items: CartItem[];
  itemSummary?: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  createdAt: Date;
  updatedAt: Date;
  statusHistory?: StatusHistoryEntry[];
  feedbackSubmitted?: boolean;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  phone?: string | null;
  role?: 'retail' | 'admin'; // Removed 'wholesale'
  isAdmin?: boolean;
  addresses?: ShippingAddress[];
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // e.g., 1-5
  reviewText: string;
  date: string; // e.g., "July 15, 2024"
  avatarUrl?: string;
}
