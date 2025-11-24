import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Category } from '../types';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/storage';
import { generateProductDescription } from '../services/geminiService';
import { logout } from '../services/auth';
import { Plus, Trash2, Edit2, Wand2, X, Save, Search, Package, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: 'Fashion',
    description: '',
    location: 'TP. Hồ Chí Minh',
    rating: 5,
    sold: 0
  });

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      originalPrice: 0,
      image: '',
      category: 'Fashion',
      description: '',
      location: 'TP. Hồ Chí Minh',
      rating: 5,
      sold: 0
    });
    setEditingProduct(null);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      alert('Vui lòng nhập tên và giá sản phẩm');
      return;
    }

    const imageToUse = formData.image || `https://picsum.photos/400/400?random=${Date.now()}`;

    if (editingProduct) {
      const updated = { ...formData, id: editingProduct.id, image: imageToUse } as Product;
      setProducts(updateProduct(updated));
    } else {
      const newProduct = { ...formData, id: Date.now().toString(), image: imageToUse } as Product;
      setProducts(addProduct(newProduct));
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(deleteProduct(id));
    }
  };

  const handleAiGenerate = async () => {
    if (!formData.name) {
      alert('Vui lòng nhập tên sản phẩm trước.');
      return;
    }
    setIsGenerating(true);
    // Simple prompt construction from available data
    const features = `Danh mục: ${formData.category}. Giá: ${formData.price}.`;
    const description = await generateProductDescription(formData.name, features);
    setFormData(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Package className="text-primary-600" /> Quản Lý Sản Phẩm
            </h1>
            <p className="text-gray-500 text-sm">Thêm, sửa, xóa sản phẩm và sử dụng AI để viết mô tả.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:flex-none">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm..." 
                    className="border border-gray-300 rounded px-3 py-2 pl-9 w-full md:w-64 focus:outline-none focus:border-primary-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <button 
                onClick={handleLogout}
                className="bg-white border border-gray-300 text-gray-600 px-3 py-2 rounded shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition flex items-center justify-center"
                title="Đăng xuất"
            >
                <LogOut className="h-4 w-4" />
            </button>

            <button 
            onClick={() => handleOpenModal()}
            className="bg-primary-600 text-white px-4 py-2 rounded shadow hover:bg-primary-700 flex items-center gap-2"
            >
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Thêm Mới</span>
            </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4 border-b">Hình ảnh</th>
                <th className="p-4 border-b">Tên sản phẩm</th>
                <th className="p-4 border-b">Giá</th>
                <th className="p-4 border-b">Kho / Đã bán</th>
                <th className="p-4 border-b">Danh mục</th>
                <th className="p-4 border-b text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded border border-gray-200" />
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="font-medium text-gray-800 line-clamp-1">{p.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{p.description}</div>
                  </td>
                  <td className="p-3 text-primary-600 font-medium">
                    {p.price.toLocaleString()}đ
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                     Sold: {p.sold}
                  </td>
                  <td className="p-3">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {p.category}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(p)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                  <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">Không có dữ liệu sản phẩm</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Nhập tên sản phẩm..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="Fashion">Thời Trang</option>
                    <option value="Electronics">Điện Tử</option>
                    <option value="Beauty">Sắc Đẹp</option>
                    <option value="Home">Nhà Cửa</option>
                    <option value="Books">Sách</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Giá (VND)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Giá gốc (VND)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">URL Hình ảnh</label>
                <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="https://example.com/image.jpg (Để trống sẽ dùng ảnh ngẫu nhiên)"
                />
              </div>

              <div className="space-y-1 relative">
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                    <button 
                        onClick={handleAiGenerate}
                        disabled={isGenerating}
                        className={`text-xs flex items-center gap-1 px-2 py-1 rounded border transition-colors ${isGenerating ? 'bg-gray-100 text-gray-400' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}
                    >
                        <Wand2 className="h-3 w-3" />
                        {isGenerating ? 'Đang viết...' : 'AI Viết Mô tả'}
                    </button>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="Nhập mô tả sản phẩm..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 flex items-center gap-2 transition"
              >
                <Save className="h-4 w-4" /> Lưu Sản Phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;