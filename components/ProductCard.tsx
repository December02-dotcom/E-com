import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`} className="block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 hover:-translate-y-1 overflow-hidden group">
      <div className="relative pt-[100%] overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount > 0 && (
          <div className="absolute top-2 right-0 bg-yellow-400 text-red-600 text-xs font-bold px-2 py-1 rounded-l-sm shadow-sm">
            Giảm {discount}%
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-xs truncate">Tìm kiếm tương tự</p>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[40px] mb-1 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-1">
            <div className="flex flex-col">
                <span className="text-primary-600 font-bold text-lg">
                    {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                     <span className="text-gray-400 text-xs line-through">
                        {formatCurrency(product.originalPrice)}
                    </span>
                )}
            </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center text-yellow-500">
            <Star className="h-3 w-3 fill-current" />
            <span className="ml-0.5">{product.rating}</span>
          </div>
          <span>Đã bán {product.sold > 1000 ? `${(product.sold / 1000).toFixed(1)}k` : product.sold}</span>
        </div>
        
        <div className="mt-2 flex items-center text-gray-400 text-[10px]">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{product.location}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;