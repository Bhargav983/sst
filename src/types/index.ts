
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  weight: string;
  imageUrl: string;
  category?: string; // Optional, e.g., "Spicy", "Mild"
  dataAiHint?: string; // For placeholder image generation
}

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  weight: string;
}

export interface ShippingAddress {
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
  notes?: string; // Optional for admin to add notes
}

export interface Order {
  id: string; // Firestore document ID
  userId?: string; // For registered users
  customerInfo: ShippingAddress; // Includes email for guests
  items: CartItem[]; // In a real app, this might be just item IDs and quantities
  itemSummary?: string; // Short summary like "Andhra Chilli Paste x2, ..."
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  createdAt: Date; // Or Firestore Timestamp
  updatedAt: Date; // Or Firestore Timestamp
  statusHistory?: StatusHistoryEntry[]; // New field for chronological status changes
}

// For AuthContext, basic user type
export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  phone?: string | null; // Added phone field
  isAdmin?: boolean; // Added for admin distinction
}

