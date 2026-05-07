import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { FiUser, FiMail, FiPhone, FiLock, FiChevronLeft, FiSave } from 'react-icons/fi';

const AccountSettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2 ml-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2 ml-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-2xl text-gray-500 font-medium cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 ml-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2 ml-1">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-medium"
                />
              </div>
            </div>

            <hr className="border-gray-100 my-8" />

            {/* Change Password Link */}
            <button className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <FiLock size={20} />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-bold">Security</h4>
                <p className="text-sm text-gray-400">Update your account password</p>
              </div>
              <span className="text-gray-300">→</span>
            </button>
          </div>

          <div className="bg-gray-50 p-8 flex justify-end">
            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-primaryDark active:scale-95 transition-all flex items-center gap-2">
              <FiSave /> Save Changes
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AccountSettingsPage;
