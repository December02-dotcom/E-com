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

export type Category = 'All' | 'Fashion' | 'Electronics' | 'Home' | 'Beauty' | 'Books';
