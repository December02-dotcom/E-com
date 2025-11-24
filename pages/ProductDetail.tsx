
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { getProducts, addToCart } from '../services/storage';
import { askAiAboutProduct } from '../services/geminiService';
import { Star, MapPin, Truck, ShieldCheck, Heart, MessageCircle, Send, ShoppingCart, Minus, Plus } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // AI Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const products = getProducts();
    const found = products.find(p => p.id === id);
    if (found) {
      setProduct(found);
      // Add initial greeting
      setChatHistory([{
        role: 'ai', 
        text: `Xin chào! Tôi là trợ lý AI. Bạn cần biết thêm gì về "${found.name}" không?`
      }]);
    }
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatOpen]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !product) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await askAiAboutProduct(product.name, product.description, userMsg);
    
    setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    setIsTyping(false);
  };

  const handleAddToCart = () => {
    if (product) {
        addToCart(product, quantity);
        alert('Đã thêm sản phẩm vào giỏ hàng!');
    }
  };

  const handleBuyNow = () => {
      if (product) {
          addToCart(product, quantity);
          navigate('/cart');
      }
  };

  if (!product) {
    return <div className="p-10 text-center">Đang tải hoặc không tìm thấy sản phẩm...</div>;
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4 flex gap-2">
            <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-800">{product.category}</span>
            <span>/</span>
            <span className="truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Main Info */}
        <div className="bg-white rounded shadow-sm p-4 grid grid-cols-1 md:grid-cols-12 gap-8 mb-6">
          {/* Image */}
          <div className="md:col-span-5">
            <div className="aspect-square bg-gray-100 rounded overflow-hidden mb-4 border border-gray-200">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
                {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square border border-gray-200 rounded overflow-hidden hover:border-primary-500 cursor-pointer">
                        <img src={product.image} className="w-full h-full object-cover opacity-70 hover:opacity-100" />
                    </div>
                ))}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-7 space-y-4">
            <h1 className="text-xl md:text-2xl font-medium text-gray-800 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-primary-600 border-b border-primary-600 cursor-pointer">
                    <span className="font-bold underline text-lg">{product.rating}</span>
                    <div className="flex text-primary-500"><Star className="fill-current w-4 h-4"/></div>
                </div>
                <div className="w-[1px] h-4 bg-gray-300"></div>
                <div className="flex items-center gap-1 text-gray-600">
                    <span className="font-bold text-lg text-gray-800">{product.sold}</span>
                    <span className="text-gray-500">Đã bán</span>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-end gap-3 flex-wrap">
                    {product.originalPrice && (
                         <span className="text-gray-400 line-through text-base">
                            {product.originalPrice.toLocaleString()}đ
                        </span>
                    )}
                    <span className="text-3xl font-medium text-primary-600">
                        {product.price.toLocaleString()}đ
                    </span>
                    {discount > 0 && (
                        <span className="bg-primary-50 text-primary-600 text-xs font-bold px-1.5 py-0.5 rounded uppercase">
                            Giảm {discount}%
                        </span>
                    )}
                </div>
            </div>

            {/* Delivery / Insurance */}
            <div className="space-y-3 text-sm text-gray-600 mt-4">
                <div className="flex items-start gap-4">
                    <span className="w-24 text-gray-400">Vận chuyển</span>
                    <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        <span>Miễn phí vận chuyển cho đơn từ 200k</span>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <span className="w-24 text-gray-400">Địa điểm</span>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{product.location}</span>
                    </div>
                </div>
            </div>
            
            <hr className="border-gray-100 my-4" />

            {/* Quantity */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="w-24 text-gray-400">Số lượng</span>
                <div className="flex items-center border border-gray-300 rounded">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 hover:bg-gray-100 border-r border-gray-300"><Minus className="w-3 h-3"/></button>
                    <input type="text" value={quantity} readOnly className="w-12 text-center py-1 outline-none" />
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 hover:bg-gray-100 border-l border-gray-300"><Plus className="w-3 h-3"/></button>
                </div>
                <span className="text-gray-400 text-xs">999 sản phẩm có sẵn</span>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
                <button 
                    onClick={handleAddToCart}
                    className="flex-1 max-w-[200px] py-3 bg-primary-50 border border-primary-500 text-primary-600 rounded flex items-center justify-center gap-2 hover:bg-primary-100 transition"
                >
                    <ShoppingCart className="w-5 h-5" /> Thêm Vào Giỏ
                </button>
                <button 
                    onClick={handleBuyNow}
                    className="flex-1 max-w-[200px] py-3 bg-primary-600 text-white rounded shadow-sm hover:bg-primary-700 transition"
                >
                    Mua Ngay
                </button>
            </div>
          </div>
        </div>

        {/* Product Details & Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                 <div className="bg-white p-6 rounded shadow-sm">
                    <h2 className="bg-gray-50 p-3 text-lg text-gray-700 font-medium rounded uppercase mb-4">Mô tả sản phẩm</h2>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {product.description}
                        <br /><br />
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Cam kết sản phẩm chính hãng 100%</li>
                            <li>Bảo hành 12 tháng</li>
                            <li>Đổi trả trong vòng 7 ngày nếu lỗi nhà sản xuất</li>
                        </ul>
                    </div>
                </div>
            </div>

             {/* AI Sidebar */}
            <div className="md:col-span-1">
                <div className={`bg-white rounded-lg shadow-sm border border-primary-100 overflow-hidden flex flex-col transition-all duration-300 ${chatOpen ? 'h-[500px]' : 'h-auto'}`}>
                    <div 
                        className="bg-gradient-to-r from-green-600 to-green-500 p-3 text-white flex justify-between items-center cursor-pointer"
                        onClick={() => setChatOpen(!chatOpen)}
                    >
                        <div className="flex items-center gap-2 font-medium">
                            <MessageCircle className="w-5 h-5" />
                            Hỏi AI về sản phẩm
                        </div>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{chatOpen ? 'Thu gọn' : 'Mở rộng'}</span>
                    </div>

                    {chatOpen && (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] text-sm p-3 rounded-lg ${
                                            msg.role === 'user' 
                                            ? 'bg-primary-600 text-white rounded-br-none' 
                                            : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none shadow-sm'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white text-gray-400 text-xs p-2 rounded-lg border italic">
                                            AI đang suy nghĩ...
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                            <form onSubmit={handleChatSubmit} className="p-3 border-t bg-white flex gap-2">
                                <input 
                                    type="text" 
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Hỏi về chất liệu, size..."
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
                                />
                                <button type="submit" className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition">
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </>
                    )}
                     {!chatOpen && (
                        <div className="p-4 text-sm text-gray-500 text-center cursor-pointer" onClick={() => setChatOpen(true)}>
                            Bạn thắc mắc về sản phẩm? <span className="text-primary-600 font-medium">Chat ngay với AI</span>
                        </div>
                    )}
                </div>
                
                <div className="mt-4 bg-white p-4 rounded shadow-sm">
                    <h3 className="text-gray-700 font-medium mb-3 flex items-center gap-2">
                        <ShieldCheck className="text-primary-600 w-5 h-5" /> PK Điện Tử - Camera Đảm Bảo
                    </h3>
                    <p className="text-xs text-gray-500">3 Ngày Trả Hàng / Hoàn Tiền</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;