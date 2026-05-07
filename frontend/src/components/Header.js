import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiShoppingCart, FiMenu, FiChevronLeft } from 'react-icons/fi';

const Header = ({ cartCount = 0, onCartClick, onMenuClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/dashboard' || location.pathname === '/';

  return (
    <header className="sticky top-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left Side: Back Button & Logo */}
        <div className="flex items-center gap-4">
          {!isHome && (
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              title="Go back"
            >
              <FiChevronLeft size={24} />
            </button>
          )}
          
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => navigate('/dashboard')}
          >
            <div className="text-2xl transition-transform group-hover:scale-110 duration-200">🌱</div>
            <span className="text-2xl font-bold text-[#10b981] italic tracking-tight">Farmfura</span>
          </div>
        </div>

        {/* Right - Profile & Cart */}
        <div className="flex items-center gap-3">
          {/* Profile Icon */}
          <button
            onClick={() => navigate('/profile')}
            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-all duration-200"
            title="Profile"
          >
            <FiUser size={24} />
          </button>

          {/* Cart Icon */}
          <button
            onClick={onCartClick}
            className="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-all duration-200"
            title="Cart"
          >
            <FiShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
