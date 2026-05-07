import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../hooks/useTranslation';
import { createOrder } from '../utils/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Toast from '../components/Toast';
import { useLocation } from '../context/LocationContext';
import { FiMapPin, FiNavigation } from 'react-icons/fi';

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const { address: currentAddress } = useLocation();
  const { cart, clearCart, getSubtotal } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [selectedAddress, setSelectedAddress] = useState('current');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [deliverySlot, setDeliverySlot] = useState('morning');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const deliveryFee = 30;
  const subtotal = getSubtotal();
  const total = subtotal + deliveryFee;

  const handleAddAddress = () => {
    if (!newAddress.address || !newAddress.city || !newAddress.pincode) {
      setToast({ message: 'Please fill all address fields', type: 'error' });
      return;
    }

    const address = {
      id: Date.now(),
      ...newAddress,
    };

    setAddresses([...addresses, address]);
    setSelectedAddress(address.id);
    setNewAddress({ label: '', address: '', city: '', state: '', pincode: '' });
    setShowAddressForm(false);
    setToast({ message: 'Address added', type: 'success' });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      setToast({ message: 'Please select an address', type: 'error' });
      return;
    }

    if (cart.length === 0) {
      setToast({ message: 'Cart is empty', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      let addressData;
      if (selectedAddress === 'current') {
        addressData = {
          label: 'Current Location',
          address: currentAddress,
          city: '',
          pincode: '',
        };
      } else {
        addressData = addresses.find((a) => a.id === selectedAddress);
      }

      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
        })),
        subtotal,
        deliveryFee,
        address: addressData,
        deliverySlot,
        paymentMethod,
      };

      const response = await createOrder(orderData, token);
      setToast({ message: 'Order placed successfully!', type: 'success' });
      clearCart();
      setTimeout(() => navigate(`/order-tracking/${response.order._id}`), 1000);
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-xl mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-white px-6 py-2 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Address Selection */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiMapPin className="text-primary" /> {t('selectAddress')}
              </h2>

              <div className="space-y-3 mb-6">
                {/* Current GPS Location */}
                <label 
                  className={`flex items-start p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    selectedAddress === 'current' 
                      ? 'border-primary bg-green-50' 
                      : 'border-gray-50 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value="current"
                    checked={selectedAddress === 'current'}
                    onChange={() => setSelectedAddress('current')}
                    className="mt-1 mr-4 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800">Current Location</span>
                      <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                        <FiNavigation size={10} /> GPS
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed italic">
                      {currentAddress || 'Locating your current address...'}
                    </p>
                  </div>
                </label>

                {addresses.map((addr) => (
                  <label 
                    key={addr.id} 
                    className={`flex items-start p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                      selectedAddress === addr.id 
                        ? 'border-primary bg-green-50' 
                        : 'border-gray-50 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-1 mr-4 accent-primary"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-1">{addr.label}</p>
                      <p className="text-sm text-gray-500">
                        {addr.address}, {addr.city} - {addr.pincode}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Address Label (Home/Office)"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      className="flex-1 px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (currentAddress) {
                          setNewAddress({
                            ...newAddress,
                            address: currentAddress,
                            label: newAddress.label || 'Current Location'
                          });
                          setToast({ message: 'Address filled from GPS', type: 'success' });
                        } else {
                          setToast({ message: 'Location not available yet', type: 'error' });
                        }
                      }}
                      className="px-4 bg-white border border-gray-100 text-primary rounded-xl hover:bg-green-50 transition-colors flex items-center gap-2 font-bold text-sm shadow-sm"
                      title="Use current GPS location"
                    >
                      <FiNavigation className="animate-pulse" /> Auto-fill
                    </button>
                  </div>
                  <textarea
                    placeholder="Full Address"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '') })}
                      maxLength={6}
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddAddress}
                      className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primaryDark"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition"
                >
                  {t('addNewAddress')}
                </button>
              )}
            </section>

            {/* Delivery Slot */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">{t('deliverySlot')}</h2>
              <div className="space-y-2">
                {['morning', 'afternoon', 'evening'].map((slot) => (
                  <label key={slot} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="slot"
                      value={slot}
                      checked={deliverySlot === slot}
                      onChange={() => setDeliverySlot(slot)}
                      className="mr-3"
                    />
                    <span>{t(slot)}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">{t('paymentMethod')}</h2>
              <div className="space-y-2">
                {['cash', 'upi', 'card'].map((method) => (
                  <label key={method} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="mr-3"
                    />
                    <span>{t(method)}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4">{t('orderConfirmed')}</h2>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('deliveryFee')}</span>
                <span className="font-semibold">₹{deliveryFee}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>{t('total')}</span>
                <span className="text-primary">₹{total}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primaryDark transition disabled:opacity-50 mt-6"
              >
                {loading ? 'Placing...' : t('placeOrder')}
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
