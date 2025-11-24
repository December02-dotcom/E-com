
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Product, Category, CategoryItem } from '../types';
import { getProducts, getCategories } from '../services/storage';
import { ChevronRight, Tag } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  useEffect(() => {
    // Load products and categories from "local DB"
    setProducts(getProducts());
    
    const loadedCategories = getCategories();
    // Add "All" category manually for the UI
    const allCategory: CategoryItem = { id: 'All', label: 'Tất cả', icon: '🛍️' };
    setCategories([allCategory, ...loadedCategories]);
  }, []);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="pb-10">
      {/* Banner Section */}
      <div className="bg-white pb-4 mb-4 shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-2 relative rounded-lg overflow-hidden h-48 md:h-64 shadow-md group">
              <img 
                src="https://picsum.photos/800/400?random=10" 
                alt="Banner 1" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <h2 className="text-white text-3xl font-bold drop-shadow-lg">Siêu Sale 10.10</h2>
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-2 h-64">
              <div className="flex-1 rounded-lg overflow-hidden relative shadow-sm">
                <img src="https://picsum.photos/400/200?random=11" className="w-full h-full object-cover" />
                 <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs font-bold text-primary-700">Freeship Extra</div>
              </div>
              <div className="flex-1 rounded-lg overflow-hidden relative shadow-sm">
                <img src="https://picsum.photos/400/200?random=12" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">Giảm 50%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Categories */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 sticky top-20 z-40 overflow-x-auto">
          <h2 className="text-gray-600 text-sm uppercase font-bold mb-3 flex items-center">
             <Tag className="w-4 h-4 mr-2 text-primary-500" /> Danh mục
          </h2>
          <div className="flex gap-4 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg min-w-[80px] transition-all duration-200 border ${
                  selectedCategory === cat.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                    : 'border-transparent hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid Header */}
        <div className="bg-white p-3 rounded-t-lg shadow-sm border-b border-gray-100 flex items-center justify-between mb-0.5">
          <h3 className="text-primary-600 font-bold uppercase text-lg border-b-2 border-primary-500 pb-1">Gợi ý hôm nay</h3>
          <button className="text-gray-500 text-sm flex items-center hover:text-primary-600">
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào trong danh mục này.</p>
            <button 
                onClick={() => setSelectedCategory('All')} 
                className="mt-4 px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
                Quay lại trang chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
