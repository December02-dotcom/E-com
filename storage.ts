import { Product } from '../types';

const STORAGE_KEY = 'greenshop_products';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Áo Thun Cotton Organic Premium',
    price: 150000,
    originalPrice: 250000,
    image: 'https://picsum.photos/400/400?random=1',
    rating: 4.8,
    sold: 1200,
    location: 'TP. Hồ Chí Minh',
    description: 'Áo thun cotton 100% thoáng mát, thấm hút mồ hôi tốt. Form dáng unisex phù hợp cho cả nam và nữ.',
    category: 'Fashion'
  },
  {
    id: '2',
    name: 'Tai Nghe Bluetooth Chống Ồn',
    price: 450000,
    originalPrice: 890000,
    image: 'https://picsum.photos/400/400?random=2',
    rating: 4.5,
    sold: 850,
    location: 'Hà Nội',
    description: 'Tai nghe không dây công nghệ mới, pin trâu 20h, âm bass cực mạnh.',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Kem Dưỡng Ẩm Trà Xanh',
    price: 220000,
    originalPrice: 300000,
    image: 'https://picsum.photos/400/400?random=3',
    rating: 4.9,
    sold: 5000,
    location: 'Đà Nẵng',
    description: 'Chiết xuất từ lá trà xanh tự nhiên, giúp làm dịu da và cấp ẩm tức thì.',
    category: 'Beauty'
  },
  {
    id: '4',
    name: 'Bình Giữ Nhiệt Lõi Thép',
    price: 120000,
    image: 'https://picsum.photos/400/400?random=4',
    rating: 4.7,
    sold: 300,
    location: 'Hà Nội',
    description: 'Giữ nóng 12h, giữ lạnh 24h. An toàn cho sức khỏe.',
    category: 'Home'
  },
  {
    id: '5',
    name: 'Sách: Tư Duy Nhanh Và Chậm',
    price: 180000,
    originalPrice: 200000,
    image: 'https://picsum.photos/400/400?random=5',
    rating: 5.0,
    sold: 150,
    location: 'TP. Hồ Chí Minh',
    description: 'Cuốn sách bán chạy nhất về tâm lý học hành vi.',
    category: 'Books'
  },
  {
    id: '6',
    name: 'Giày Sneaker Thể Thao',
    price: 550000,
    originalPrice: 900000,
    image: 'https://picsum.photos/400/400?random=6',
    rating: 4.6,
    sold: 2100,
    location: 'Hải Phòng',
    description: 'Giày siêu nhẹ, đế êm, thích hợp chạy bộ và đi chơi.',
    category: 'Fashion'
  }
];

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const addProduct = (product: Product) => {
  const products = getProducts();
  const newProducts = [product, ...products];
  saveProducts(newProducts);
  return newProducts;
};

export const updateProduct = (updatedProduct: Product) => {
  const products = getProducts();
  const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
  saveProducts(newProducts);
  return newProducts;
};

export const deleteProduct = (id: string) => {
  const products = getProducts();
  const newProducts = products.filter(p => p.id !== id);
  saveProducts(newProducts);
  return newProducts;
};
