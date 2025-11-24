
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartQuantity, removeFromCart, clearCart } from '../services/storage';
import { CartItem } from '../types';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleUpdateQuantity = (id: string, newQty: number) => {
    const updated = updateCartQuantity(id, newQty);
    setCartItems(updated);
  };

  const handleRemove = (id: string) => {
    const updated = removeFromCart(id);
    setCartItems(updated);
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-2xl shadow-sm text-center max-w-md w-full">
            <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-500 mb-8">Hãy dạo một vòng và chọn những món đồ ưng ý nhé!</p>
            <Link to="/" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition">
                Tiếp tục mua sắm
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShoppingBag className="text-primary-600" /> Giỏ Hàng
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items List */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-4 bg-gray-50 border-b border-gray-100 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-6">Sản phẩm</div>
                    <div className="col-span-2 text-center">Đơn giá</div>
                    <div className="col-span-2 text-center">Số lượng</div>
                    <div className="col-span-2 text-center">Thao tác</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                        <div key={item.id} className="p-4 grid grid-cols-12 gap-4 items-center group hover:bg-gray-50/50 transition">
                            <div className="col-span-6 flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                                <div>
                                    <Link to={`/product/${item.id}`} className="font-medium text-gray-800 line-clamp-2 hover:text-primary-600 transition">
                                        {item.name}
                                    </Link>
                                    <p className="text-xs text-gray-400 mt-1">{item.category}</p>
                                </div>
                            </div>
                            <div className="col-span-2 text-center font-medium text-gray-700">
                                {item.price.toLocaleString()}đ
                            </div>
                            <div className="col-span-2 flex justify-center">
                                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                                    <button 
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                        className="p-1.5 hover:bg-gray-100 text-gray-500 transition"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                    <button 
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        className="p-1.5 hover:bg-gray-100 text-gray-500 transition"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="col-span-2 text-center">
                                <button 
                                    onClick={() => handleRemove(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full"
                                    title="Xóa sản phẩm"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <button 
                onClick={() => {
                    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
                        clearCart();
                        setCartItems([]);
                    }
                }}
                className="mt-4 text-sm text-red-500 hover:text-red-700 hover:underline transition"
            >
                Xóa tất cả
            </button>
          </div>

          {/* Summary */}
          <div className="lg:w-80">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Thanh Toán</h3>
                
                <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between text-gray-500">
                        <span>Tạm tính</span>
                        <span>{totalAmount.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Giảm giá</span>
                        <span>0đ</span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-end">
                        <span className="font-semibold text-gray-800">Tổng cộng</span>
                        <span className="text-2xl font-bold text-primary-600">{totalAmount.toLocaleString()}đ</span>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium shadow-md hover:bg-primary-700 hover:shadow-lg transition flex items-center justify-center gap-2 group"
                >
                    Mua Hàng <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">Nhấn "Mua Hàng" để nhập thông tin giao nhận.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
