
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, ShoppingBag, Globe } from 'lucide-react';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-200 mt-10 pt-12 pb-8 text-gray-600">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Column */}
                    <div>
                         <div className="flex items-center gap-2 text-primary-600 mb-4">
                            <ShoppingBag className="h-6 w-6" />
                            <span className="text-xl font-bold">GreenShop</span>
                         </div>
                         <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Nền tảng thương mại điện tử hàng đầu, chuyên cung cấp các sản phẩm xanh, sạch và chất lượng cao cho cuộc sống hiện đại.
                         </p>
                         
                         <div className="flex flex-col gap-3">
                             <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Ghé thăm gian hàng</p>
                             <div className="flex flex-wrap gap-3">
                                {/* Shopee Link */}
                                <a 
                                    href="https://shopee.vn/phukien_dientu_camera" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-[#fff5f1] border border-[#ee4d2d] text-[#ee4d2d] rounded-lg hover:bg-[#ffeke6] transition shadow-sm group"
                                >
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopee_logo.svg" 
                                        alt="Shopee" 
                                        className="h-5 w-auto"
                                    />
                                    <span className="font-bold text-sm">Shopee</span>
                                </a>

                                {/* Zalo Link */}
                                <a 
                                    href="https://zalo.me/0706010948" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-[#eef4ff] border border-[#0068ff] text-[#0068ff] rounded-lg hover:bg-[#e1ebff] transition shadow-sm"
                                >
                                    <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" 
                                        alt="Zalo" 
                                        className="h-6 w-6"
                                    />
                                    <span className="font-bold text-sm">Chat Zalo</span>
                                </a>
                             </div>
                         </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-widest">Về GreenShop</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-primary-600 transition">Giới thiệu</a></li>
                            <li><a href="#" className="hover:text-primary-600 transition">Tuyển dụng</a></li>
                            <li><a href="#" className="hover:text-primary-600 transition">Điều khoản dịch vụ</a></li>
                            <li><a href="#" className="hover:text-primary-600 transition">Chính sách bảo mật</a></li>
                            <li><a href="#" className="hover:text-primary-600 transition">Chương trình Affiliate</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-widest">Chăm sóc khách hàng</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-primary-600 transition">Trung tâm trợ giúp</a></li>
                            <li><a href="#" className="hover:text-primary-600 transition">Hướng dẫn mua hàng</a></li>
                            <li><a href="#" className="hover:text-primary-600 transition">Chính sách đổi trả</a></li>
                            <li><a href="#" className="hover:text-primary-600 transition">Vận chuyển & Giao nhận</a></li>
                            <li><a href="#" className="hover:text-primary-600 transition">Báo lỗi hệ thống</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-widest">Liên hệ</h3>
                        <ul className="space-y-4 text-sm">
                             <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                <span>Tầng 12, Tòa nhà GreenTech, Quận 1, TP. Hồ Chí Minh, Việt Nam</span>
                             </li>
                             <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary-600 shrink-0" />
                                <span className="font-medium">070 601 0948</span>
                             </li>
                             <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary-600 shrink-0" />
                                <span>support@greenshop.vn</span>
                             </li>
                             <li className="pt-4 flex gap-3">
                                <a href="#" className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition"><Facebook className="w-4 h-4" /></a>
                                <a href="#" className="w-9 h-9 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition"><Instagram className="w-4 h-4" /></a>
                                <a href="#" className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center hover:bg-sky-100 transition"><Twitter className="w-4 h-4" /></a>
                             </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">© 2023 GreenShop. Tất cả các quyền được bảo lưu.</p>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> Tiếng Việt</span>
                        <span>Quốc gia: Việt Nam</span>
                    </div>
                </div>
            </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
