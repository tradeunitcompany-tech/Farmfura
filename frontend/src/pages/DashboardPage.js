import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../hooks/useTranslation';
import { getProducts } from '../utils/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import Toast from '../components/Toast';
import { FiMic, FiSearch } from 'react-icons/fi';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useCart();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [toast, setToast] = useState(null);

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setToast({ message: 'Voice search not supported in this browser', type: 'error' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
      setToast({ message: `Searching for: "${transcript}"`, type: 'success' });
    };

    recognition.start();
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts(
          selectedCategory !== 'all' ? selectedCategory : null,
          searchText || null
        );
        setFilteredProducts(response.products || []);
      } catch (error) {
        setToast({ message: 'Failed to load products', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchText]);

  const categories = ['all', 'leafy', 'roots', 'vegetables', 'herbs'];

  const handleAddToCart = (product) => {
    addToCart(product);
    setToast({ message: `${product.name} added to cart!`, type: 'success' });
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
    setToast({ message: 'Item removed from cart', type: 'success' });
  };

  const isInCart = (productId) => cart.some((item) => item._id === productId);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <Header
        cartCount={cart.length}
        onCartClick={() => setIsCartOpen(true)}
        onMenuClick={() => {}}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
            <FiSearch size={20} />
          </div>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t('search')}
            className="w-full pl-12 pr-12 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary transition-all text-gray-800 placeholder-gray-400 font-medium"
          />
          <button 
            onClick={startVoiceSearch}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
              isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-gray-400 hover:bg-gray-100 hover:text-primary'
            }`}
            title="Voice Search"
          >
            <FiMic size={20} />
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('loading') || 'Loading...'}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                inCart={isInCart(product._id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => navigate('/checkout')}
      />

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
