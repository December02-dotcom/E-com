import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
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
        
        <footer className="bg-white border-t border-gray-200 mt-10 py-8">
            <div className="container mx-auto px-4 text-center">
                <h3 className="font-bold text-gray-700 mb-2">GreenShop E-Commerce</h3>
                <p className="text-sm text-gray-500">© 2023 GreenShop. Tất cả các quyền được bảo lưu.</p>
                <div className="mt-4 flex justify-center gap-4 text-sm text-gray-400">
                    <span>Chính sách bảo mật</span>
                    <span>Điều khoản dịch vụ</span>
                    <span>Quy chế hoạt động</span>
                </div>
            </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;