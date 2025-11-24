
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đặt Hàng Thành Công!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
            Cảm ơn bạn đã mua sắm tại <span className="font-bold text-primary-600">GreenShop</span>. <br/>
            Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
        </p>
        
        <div className="flex flex-col gap-3">
             <Link to="/" className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition shadow-md">
                Tiếp Tục Mua Sắm
            </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
