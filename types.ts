
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold: number;
  location: string;
  description: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CategoryItem {
  id: string;
  label: string;
  icon: string;
}

export type OrderStatus = 'pending' | 'shipping' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string; // ISO Date string
}

// Relaxing Category to string to allow dynamic categories
export type Category = string;
