import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiUser, FiLogOut } from 'react-icons/fi';

const BottomNav = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around">
        <Link
          to="/dashboard"
          className="flex-1 flex flex-col items-center justify-center py-3 text-primary hover:bg-gray-50"
        >
          <FiHome size={24} />
          <span className="text-xs mt-1">{t('dashboard')}</span>
        </Link>
        <Link
          to="/orders"
          className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:bg-gray-50"
        >
          <FiShoppingBag size={24} />
          <span className="text-xs mt-1">{t('myOrders')}</span>
        </Link>
        <Link
          to="/profile"
          className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:bg-gray-50"
        >
          <FiUser size={24} />
          <span className="text-xs mt-1">{t('profile')}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center py-3 text-gray-600 hover:bg-gray-50"
        >
          <FiLogOut size={24} />
          <span className="text-xs mt-1">{t('logout')}</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
