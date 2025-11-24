
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, ShoppingBag, Edit3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartCount } from '../services/storage';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial load
    setCartCount(getCartCount());

    // Listen for storage changes (for multiple tabs) or custom events
    const handleCartChange = () => {
      setCartCount(getCartCount());
    };

    window.addEventListener('cart-change', handleCartChange);
    // Optional: listen to storage event for cross-tab sync
    window.addEventListener('storage', handleCartChange);

    return () => {
      window.removeEventListener('cart-change', handleCartChange);
      window.removeEventListener('storage', handleCartChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-green-600 to-primary-500 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white hover:opacity-90 transition">
            <ShoppingBag className="h-8 w-8" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold leading-none">PK Điện Tử - Camera</h1>
              <p className="text-xs opacity-90">Mua gì cũng có</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative group">
            <input
              type="text"
              placeholder="Tìm sản phẩm, thương hiệu..."
              className="w-full py-2.5 pl-4 pr-12 rounded-lg border-none focus:ring-2 focus:ring-green-800 outline-none text-gray-700 shadow-sm transition-all"
            />
            <button className="absolute right-1.5 top-1.5 bg-green-700 hover:bg-green-800 text-white p-1.5 rounded-md transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 text-white">
            <Link to="/admin" className="flex flex-col items-center hover:opacity-80 transition group" title="Quản lý Shop">
                <Edit3 className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs mt-0.5 font-medium hidden md:block">Quản lý</span>
            </Link>

            <Link to="/cart" className="flex flex-col items-center hover:opacity-80 transition cursor-pointer relative group">
              <div className="relative">
                <ShoppingCart className="h-7 w-7 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-green-600 animate-bounce">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;