import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { FiMapPin, FiPlus, FiTrash2, FiChevronLeft, FiNavigation } from 'react-icons/fi';
import { useLocation } from '../context/LocationContext';

const AddressesPage = () => {
  const { user } = useAuth();
  const { address: currentAddress } = useLocation();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState(user?.addresses || []);

  const handleAddFromGPS = () => {
    if (!currentAddress) return;
    
    const newAddr = {
      _id: Date.now().toString(),
      label: 'Current Location',
      address: currentAddress,
      isDefault: addresses.length === 0,
    };
    
    setAddresses([...addresses, newAddr]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">My Addresses</h1>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleAddFromGPS}
            className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-primaryDark active:scale-95 transition-all flex items-center justify-center gap-3 mb-6"
          >
            <FiNavigation className="animate-pulse" size={20} /> Add from Current GPS
          </button>

          {addresses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="text-6xl mb-4 text-gray-200 flex justify-center">
                <FiMapPin />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No addresses found</h3>
              <p className="text-gray-400 mb-6">Add a delivery address to get started</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div key={addr._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="bg-green-50 p-3 rounded-xl text-primary">
                  <FiMapPin size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg">{addr.label}</h3>
                    {addr.isDefault && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">Default</span>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {addr.address}{addr.city ? `, ${addr.city}` : ''}{addr.state ? `, ${addr.state}` : ''}{addr.pincode ? ` - ${addr.pincode}` : ''}
                  </p>
                </div>
                <button className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))
          )}

          <button className="w-full mt-2 bg-white border-2 border-dashed border-gray-200 text-gray-500 py-6 rounded-2xl font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
            <FiPlus size={20} /> Add Manually
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AddressesPage;
