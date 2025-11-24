
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, createOrder, getCartCount } from '../services/storage';
import { CartItem } from '../types';
import { MapPin, Phone, User, CheckCircle2, ChevronLeft } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      navigate('/cart');
    }
    setCartItems(items);
  }, [navigate]);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    createOrder(formData);
    navigate('/order-success');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={() => navigate('/cart')} className="flex items-center text-gray-500 hover:text-primary-600 mb-6 transition">
            <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại giỏ hàng
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Xác Nhận Đặt Hàng</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shipping Info */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="text-primary-600 w-5 h-5" /> Thông tin giao hàng
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="Nguyễn Văn A"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input 
                                    type="tel" 
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="0912345678"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng</label>
                            <textarea 
                                required
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                placeholder="Số nhà, tên đường, phường/xã..."
                                value={formData.address}
                                onChange={e => setFormData({...formData, address: e.target.value})}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                     <h3 className="font-bold text-lg text-gray-800 mb-4">Phương thức thanh toán</h3>
                     <div className="p-4 border border-primary-200 bg-primary-50 rounded-lg flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-4 border-primary-600"></div>
                        <span className="font-medium text-gray-700">Thanh toán khi nhận hàng (COD)</span>
                     </div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Đơn hàng của bạn</h3>
                <div className="max-h-[300px] overflow-y-auto pr-2 mb-4 space-y-3 custom-scrollbar">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3 text-sm">
                            <img src={item.image} className="w-12 h-12 rounded object-cover border border-gray-200" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                <p className="text-gray-500">x{item.quantity}</p>
                            </div>
                            <div className="font-medium text-gray-700">
                                {(item.price * item.quantity).toLocaleString()}đ
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-500">
                        <span>Tổng tiền hàng</span>
                        <span>{totalAmount.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Phí vận chuyển</span>
                        <span className="text-green-600 font-medium">Miễn phí</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200 mt-2">
                        <span className="font-bold text-gray-800 text-lg">Tổng thanh toán</span>
                        <span className="font-bold text-primary-600 text-2xl">{totalAmount.toLocaleString()}đ</span>
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full mt-6 bg-primary-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-primary-700 hover:shadow-xl transition transform active:scale-95"
                >
                    Đặt Hàng Ngay
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
