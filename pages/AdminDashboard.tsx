
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, CategoryItem, Order } from '../types';
import { 
  getProducts, addProduct, updateProduct, deleteProduct,
  getCategories, addCategory, updateCategory, deleteCategory,
  getOrders, updateOrderStatus
} from '../services/storage';
import { generateProductDescription } from '../services/geminiService';
import { logout } from '../services/auth';
import { 
  Plus, Trash2, Edit2, Wand2, X, Save, Search, 
  Package, LogOut, TrendingUp, DollarSign, ShoppingBag, 
  BarChart3, Filter, Layers, Tag, ClipboardList, CheckCircle, Truck, Clock, AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');
  
  // Product States
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Category States
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Order States
  const [orders, setOrders] = useState<Order[]>([]);

  const navigate = useNavigate();

  // Product Form Data
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: '', 
    description: '',
    location: 'TP. Hồ Chí Minh',
    rating: 5,
    sold: 0
  });

  // Category Form Data
  const [categoryForm, setCategoryForm] = useState<Partial<CategoryItem>>({
    id: '',
    label: '',
    icon: ''
  });

  useEffect(() => {
    const loadedProducts = getProducts();
    const loadedCategories = getCategories();
    const loadedOrders = getOrders();
    setProducts(loadedProducts);
    setCategories(loadedCategories);
    setOrders(loadedOrders);

    // Set default category for product form
    if (loadedCategories.length > 0) {
        setProductForm(prev => ({ ...prev, category: loadedCategories[0].id }));
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- Product Handlers ---

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: 0,
      originalPrice: 0,
      image: '',
      category: categories.length > 0 ? categories[0].id : '',
      description: '',
      location: 'TP. Hồ Chí Minh',
      rating: 5,
      sold: 0
    });
    setEditingProduct(null);
  };

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm(product);
    } else {
      resetProductForm();
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price) {
      alert('Vui lòng nhập tên và giá sản phẩm');
      return;
    }

    const imageToUse = productForm.image || `https://picsum.photos/400/400?random=${Date.now()}`;

    if (editingProduct) {
      const updated = { ...productForm, id: editingProduct.id, image: imageToUse } as Product;
      setProducts(updateProduct(updated));
    } else {
      const newProduct = { ...productForm, id: Date.now().toString(), image: imageToUse } as Product;
      setProducts(addProduct(newProduct));
    }
    setIsProductModalOpen(false);
    resetProductForm();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(deleteProduct(id));
    }
  };

  const handleAiGenerate = async () => {
    if (!productForm.name) {
      alert('Vui lòng nhập tên sản phẩm trước.');
      return;
    }
    setIsGenerating(true);
    const features = `Danh mục: ${productForm.category}. Giá: ${productForm.price}.`;
    const description = await generateProductDescription(productForm.name, features);
    setProductForm(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  // --- Category Handlers ---

  const resetCategoryForm = () => {
    setCategoryForm({ id: '', label: '', icon: '📦' });
    setEditingCategory(null);
  };

  const handleOpenCategoryModal = (category?: CategoryItem) => {
    if (category) {
        setEditingCategory(category);
        setCategoryForm(category);
    } else {
        resetCategoryForm();
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
      if (!categoryForm.label || !categoryForm.icon) {
          alert("Vui lòng nhập tên và biểu tượng danh mục");
          return;
      }

      if (editingCategory) {
          const updated = { ...categoryForm, id: editingCategory.id } as CategoryItem;
          setCategories(updateCategory(updated));
      } else {
          const newId = categoryForm.label?.toLowerCase().replace(/ /g, '-') || Date.now().toString();
          const newCategory = { ...categoryForm, id: newId } as CategoryItem;
          setCategories(addCategory(newCategory));
      }
      setIsCategoryModalOpen(false);
      resetCategoryForm();
  };

  const handleDeleteCategory = (id: string) => {
      if (confirm('Xóa danh mục này có thể ảnh hưởng đến sản phẩm thuộc danh mục đó. Bạn có chắc chắn?')) {
          setCategories(deleteCategory(id));
      }
  };

  // --- Order Handlers ---
  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
      const updated = updateOrderStatus(orderId, status);
      setOrders(updated);
  };

  // --- Filter Logic ---
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(productSearchQuery.toLowerCase());
    const matchCategory = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    return matchSearch && matchCategory;
  });

  // --- Stats ---
  const totalRevenue = products.reduce((acc, p) => acc + (p.price * p.sold), 0); // Mock revenue
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const StatCard = ({ title, value, icon: Icon, colorClass, subtext }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {subtext && <p className="text-xs text-green-600 mt-2 flex items-center gap-1"><TrendingUp className="h-3 w-3"/> {subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Navigation Bar for Admin */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-3 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-800">Quản Trị Cửa Hàng</h1>
                <p className="text-xs text-gray-500">Tổng quan hệ thống GreenShop</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">Admin User</p>
                <p className="text-xs text-green-600">Đang hoạt động</p>
            </div>
            <button 
                onClick={handleLogout}
                className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition"
                title="Đăng xuất"
            >
                <LogOut className="h-5 w-5" />
            </button>
         </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Đơn Hàng Mới" 
                value={pendingOrders} 
                icon={ClipboardList} 
                colorClass="bg-blue-500"
                subtext="Chờ xử lý"
            />
            <StatCard 
                title="Tổng Doanh Thu" 
                value={`${(totalRevenue / 1000000).toFixed(1)}M đ`} 
                icon={DollarSign} 
                colorClass="bg-green-500"
                subtext="Từ trước đến nay"
            />
            <StatCard 
                title="Tổng Sản Phẩm" 
                value={products.length} 
                icon={Package} 
                colorClass="bg-orange-500" 
                subtext="Đang kinh doanh"
            />
            <StatCard 
                title="Tổng Danh Mục" 
                value={categories.length} 
                icon={Layers} 
                colorClass="bg-purple-500"
                subtext="Ngành hàng"
            />
        </div>

        {/* TABS */}
        <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-8 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('products')}
                    className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'products' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <span className="flex items-center gap-2"><Package className="w-4 h-4"/> Quản lý Sản Phẩm</span>
                    {activeTab === 'products' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('categories')}
                    className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'categories' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <span className="flex items-center gap-2"><Tag className="w-4 h-4"/> Quản lý Danh Mục</span>
                    {activeTab === 'categories' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === 'orders' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <span className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4"/> Quản lý Đơn Hàng
                        {pendingOrders > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingOrders}</span>}
                    </span>
                    {activeTab === 'orders' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
                </button>
            </div>
        </div>

        {/* === PRODUCTS TAB === */}
        {activeTab === 'products' && (
            <>
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm theo tên sản phẩm..." 
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                                value={productSearchQuery}
                                onChange={(e) => setProductSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-gray-400" />
                        </div>
                        <select 
                            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white appearance-none cursor-pointer"
                            value={selectedCategoryFilter}
                            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        >
                            <option value="All">Tất cả danh mục</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleOpenProductModal()}
                        className="w-full md:w-auto bg-primary-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-primary-700 hover:shadow-lg transition flex items-center justify-center gap-2 font-medium"
                    >
                        <Plus className="h-5 w-5" /> Thêm Sản Phẩm
                    </button>
                </div>

                {/* Product Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase font-semibold tracking-wider">
                        <tr>
                        <th className="p-4 border-b border-gray-100">Sản phẩm</th>
                        <th className="p-4 border-b border-gray-100">Giá bán</th>
                        <th className="p-4 border-b border-gray-100 text-center">Trạng thái</th>
                        <th className="p-4 border-b border-gray-100">Doanh số</th>
                        <th className="p-4 border-b border-gray-100">Danh mục</th>
                        <th className="p-4 border-b border-gray-100 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm" />
                                    <div className="max-w-[200px]">
                                        <div className="font-medium text-gray-800 line-clamp-1">{p.name}</div>
                                        <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                        ID: {p.id.slice(-6)}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="font-semibold text-gray-700">{p.price.toLocaleString()}đ</div>
                                {p.originalPrice && <div className="text-xs text-gray-400 line-through">{p.originalPrice.toLocaleString()}đ</div>}
                            </td>
                            <td className="p-4 text-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                    Đang bán
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="text-sm text-gray-600 font-medium">{p.sold.toLocaleString()} đã bán</div>
                                <div className="text-xs text-gray-400">Doanh thu: {((p.sold * p.price)/1000000).toFixed(1)}M</div>
                            </td>
                            <td className="p-4">
                                {(() => {
                                    const cat = categories.find(c => c.id === p.category);
                                    return (
                                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 flex items-center gap-1 w-fit">
                                            {cat ? <>{cat.icon} {cat.label}</> : p.category}
                                        </span>
                                    )
                                })()}
                            </td>
                            <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                onClick={() => handleOpenProductModal(p)}
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                                title="Chỉnh sửa"
                                >
                                <Edit2 className="h-4 w-4" />
                                </button>
                                <button 
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                                title="Xóa"
                                >
                                <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-gray-400 bg-white">
                                    <div className="flex flex-col items-center justify-center">
                                        <Package className="h-12 w-12 text-gray-200 mb-3" />
                                        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
                </div>
            </>
        )}

        {/* === CATEGORIES TAB === */}
        {activeTab === 'categories' && (
            <>
                {/* Toolbar */}
                <div className="flex justify-end mb-6">
                     <button 
                        onClick={() => handleOpenCategoryModal()}
                        className="bg-primary-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-primary-700 hover:shadow-lg transition flex items-center justify-center gap-2 font-medium"
                    >
                        <Plus className="h-5 w-5" /> Thêm Danh Mục Mới
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                         <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center group hover:shadow-md transition">
                             <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                     {cat.icon}
                                 </div>
                                 <div>
                                     <h3 className="font-bold text-gray-800">{cat.label}</h3>
                                     <p className="text-xs text-gray-500">ID: {cat.id}</p>
                                 </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleOpenCategoryModal(cat)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button 
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                             </div>
                         </div>
                    ))}
                </div>
            </>
        )}

        {/* === ORDERS TAB === */}
        {activeTab === 'orders' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="p-4 border-b border-gray-100">Mã đơn</th>
                                <th className="p-4 border-b border-gray-100">Khách hàng</th>
                                <th className="p-4 border-b border-gray-100">Tổng tiền</th>
                                <th className="p-4 border-b border-gray-100">Ngày đặt</th>
                                <th className="p-4 border-b border-gray-100">Trạng thái</th>
                                <th className="p-4 border-b border-gray-100 text-right">Xử lý</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition">
                                    <td className="p-4 font-medium text-gray-800">{order.id}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-800">{order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                                        <div className="text-xs text-gray-400 line-clamp-1 max-w-[200px]" title={order.customerAddress}>{order.customerAddress}</div>
                                    </td>
                                    <td className="p-4 font-bold text-primary-600">
                                        {order.totalAmount.toLocaleString()}đ
                                        <div className="text-xs font-normal text-gray-400">{order.items.length} sản phẩm</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        <br/>
                                        <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</span>
                                    </td>
                                    <td className="p-4">
                                        {order.status === 'pending' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200"><Clock className="w-3 h-3"/> Chờ xử lý</span>}
                                        {order.status === 'shipping' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"><Truck className="w-3 h-3"/> Đang giao</span>}
                                        {order.status === 'completed' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"><CheckCircle className="w-3 h-3"/> Hoàn thành</span>}
                                        {order.status === 'cancelled' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"><X className="w-3 h-3"/> Đã hủy</span>}
                                    </td>
                                    <td className="p-4 text-right">
                                        {order.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleUpdateStatus(order.id, 'shipping')} className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100">Giao hàng</button>
                                                <button onClick={() => handleUpdateStatus(order.id, 'cancelled')} className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-200 hover:bg-red-100">Hủy</button>
                                            </div>
                                        )}
                                        {order.status === 'shipping' && (
                                            <button onClick={() => handleUpdateStatus(order.id, 'completed')} className="px-3 py-1 bg-green-50 text-green-600 rounded text-xs font-medium border border-green-200 hover:bg-green-100">Hoàn thành</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-200"/>
                                        Chưa có đơn hàng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                    {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Điền thông tin chi tiết cho sản phẩm</p>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow"
                        placeholder="Ví dụ: Áo thun nam cao cấp..."
                    />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400">₫</span>
                    <input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Giá gốc (VNĐ)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400">₫</span>
                    <input
                        type="number"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({...productForm, originalPrice: Number(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Danh mục</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                  >
                    {categories.map(c => (
                         <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                 
                 <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Kho hàng / Địa điểm</label>
                    <input
                        type="text"
                        value={productForm.location}
                        onChange={(e) => setProductForm({...productForm, location: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Link Hình ảnh</label>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={productForm.image}
                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="https://..."
                    />
                    <div className="w-12 h-12 rounded border border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden">
                        {productForm.image ? <img src={productForm.image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-300"><Package className="w-5 h-5"/></div>}
                    </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-semibold text-gray-700">Mô tả sản phẩm</label>
                    <button 
                        onClick={handleAiGenerate}
                        disabled={isGenerating}
                        className={`text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${isGenerating ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200 hover:shadow-sm hover:from-green-100 hover:to-green-200'}`}
                    >
                        <Wand2 className="h-3.5 w-3.5" />
                        {isGenerating ? 'Đang viết mô tả...' : 'Dùng AI viết mô tả'}
                    </button>
                </div>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-primary-500 outline-none resize-none text-sm leading-relaxed"
                  placeholder="Nhập thông tin chi tiết về sản phẩm..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSaveProduct}
                className="px-8 py-2.5 bg-primary-600 text-white font-medium rounded-lg shadow-md hover:bg-primary-700 hover:shadow-lg flex items-center gap-2 transition transform active:scale-95"
              >
                <Save className="h-5 w-5" /> Lưu lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-800">
                  {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
              </h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Tên danh mục <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={categoryForm.label}
                        onChange={(e) => setCategoryForm({...categoryForm, label: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="Ví dụ: Giày dép"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Biểu tượng (Emoji) <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={categoryForm.icon}
                            onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none text-center text-2xl"
                            placeholder="👟"
                            maxLength={5}
                        />
                    </div>
                    <p className="text-xs text-gray-500">Bạn có thể copy emoji từ bàn phím hoặc web</p>
                </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
              >
                Hủy
              </button>
              <button 
                onClick={handleSaveCategory}
                className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg shadow-md hover:bg-primary-700 transition"
              >
                Lưu danh mục
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
