import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useLocation } from '../context/LocationContext';
import { FiUser, FiMap, FiGift, FiMapPin, FiRefreshCw } from 'react-icons/fi';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { address, requestLocation } = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary to-primaryDark text-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl border-4 border-white/30">
              👤
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{user?.name || 'User'}</h1>
              <p className="text-green-50">{user?.phone || user?.email}</p>
            </div>
          </div>
        </div>

        {/* Delivery Location Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <FiMapPin className="text-primary" /> Delivery Location
            </h2>
            <button 
              onClick={requestLocation}
              className="text-primary hover:bg-green-50 p-2 rounded-full transition-colors"
              title="Update Location"
            >
              <FiRefreshCw size={18} />
            </button>
          </div>
          <p className="text-gray-800 font-medium leading-relaxed">
            {address}
          </p>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {/* Addresses */}
          <div
            onClick={() => navigate('/addresses')}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all flex items-center gap-6 group"
          >
            <div className="bg-green-50 p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <FiMap size={32} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl">My Addresses</h3>
              <p className="text-sm text-gray-400">Manage your delivery locations</p>
            </div>
            <span className="text-2xl text-gray-200 group-hover:text-primary transition-colors">→</span>
          </div>

          {/* Account Settings */}
          <div
            onClick={() => navigate('/account-settings')}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all flex items-center gap-6 group"
          >
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <FiUser size={32} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl">Account Settings</h3>
              <p className="text-sm text-gray-400">Update your personal details</p>
            </div>
            <span className="text-2xl text-gray-200 group-hover:text-blue-500 transition-colors">→</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-8 bg-red-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-red-600 active:scale-[0.98] transition-all duration-200"
        >
          {t('logout')}
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-4 bg-white border-2 border-gray-100 text-gray-500 py-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-200 active:scale-[0.98] transition-all duration-200"
        >
          ← {t('backToHome') || 'Back to Home'}
        </button>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
