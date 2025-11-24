
import { Product, CategoryItem, CartItem, Order } from '../types';

const STORAGE_KEY = 'greenshop_products';
const CATEGORY_STORAGE_KEY = 'greenshop_categories';
const CART_STORAGE_KEY = 'greenshop_cart';
const ORDER_STORAGE_KEY = 'greenshop_orders';

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

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'Fashion', label: 'Thời Trang', icon: '👕' },
  { id: 'Electronics', label: 'Điện Tử', icon: '📱' },
  { id: 'Beauty', label: 'Sắc Đẹp', icon: '💄' },
  { id: 'Home', label: 'Nhà Cửa', icon: '🏠' },
  { id: 'Books', label: 'Sách', icon: '📚' },
];

// Helper to trigger custom event for UI updates
const notifyCartChange = () => {
  window.dispatchEvent(new Event('cart-change'));
};

// --- Product Methods ---

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

// --- Category Methods ---

export const getCategories = (): CategoryItem[] => {
  const stored = localStorage.getItem(CATEGORY_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  return JSON.parse(stored);
};

export const saveCategories = (categories: CategoryItem[]) => {
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
};

export const addCategory = (category: CategoryItem) => {
  const categories = getCategories();
  const newCategories = [...categories, category];
  saveCategories(newCategories);
  return newCategories;
};

export const updateCategory = (updatedCategory: CategoryItem) => {
  const categories = getCategories();
  const newCategories = categories.map(c => c.id === updatedCategory.id ? updatedCategory : c);
  saveCategories(newCategories);
  return newCategories;
};

export const deleteCategory = (id: string) => {
  const categories = getCategories();
  const newCategories = categories.filter(c => c.id !== id);
  saveCategories(newCategories);
  return newCategories;
};

// --- Cart Methods ---

export const getCart = (): CartItem[] => {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToCart = (product: Product, quantity: number = 1) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  let newCart;
  if (existingItem) {
    newCart = cart.map(item => 
      item.id === product.id 
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    newCart = [...cart, { ...product, quantity }];
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  notifyCartChange();
  return newCart;
};

export const updateCartQuantity = (productId: string, quantity: number) => {
  const cart = getCart();
  let newCart;
  if (quantity <= 0) {
    newCart = cart.filter(item => item.id !== productId);
  } else {
    newCart = cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  notifyCartChange();
  return newCart;
};

export const removeFromCart = (productId: string) => {
  const cart = getCart();
  const newCart = cart.filter(item => item.id !== productId);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  notifyCartChange();
  return newCart;
};

export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
  notifyCartChange();
};

export const getCartCount = (): number => {
  const cart = getCart();
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

// --- Order Methods ---

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(ORDER_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const createOrder = (customerInfo: { name: string, phone: string, address: string }) => {
  const cart = getCart();
  if (cart.length === 0) return null;

  const orders = getOrders();
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    customerName: customerInfo.name,
    customerPhone: customerInfo.phone,
    customerAddress: customerInfo.address,
    items: cart,
    totalAmount,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const newOrders = [newOrder, ...orders];
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(newOrders));
  clearCart(); // Clear cart after order
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const orders = getOrders();
    const newOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(newOrders));
    return newOrders;
};
