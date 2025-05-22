
export interface ProductImage {
  url: string;
  dataAiHint?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  weight: string;
  images: ProductImage[];
  category?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  weight: string;
}

export interface ShippingAddress {
  id?: string; // Made optional for new addresses, will be assigned when saved
  label?: string; // e.g., "Home", "Work"
  fullName: string;
  email: string; // Kept for guest checkout or if primary email differs
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
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  phone?: string | null;
  isAdmin?: boolean;
  addresses?: ShippingAddress[]; // Array of saved addresses
}
