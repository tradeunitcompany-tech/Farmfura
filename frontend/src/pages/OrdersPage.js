import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { getUserOrders } from '../utils/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Toast from '../components/Toast';

const OrdersPage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getUserOrders(user.id, localStorage.getItem('token'));
        setOrders(response.orders || []);
      } catch (error) {
        setToast({ message: 'Failed to load orders', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) return null;

  const statusColors = {
    searching: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    on_the_way: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  };

  const statusLabels = {
    searching: t('searching'),
    assigned: t('assigned'),
    on_the_way: t('onTheWay'),
    delivered: t('delivered'),
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('orderHistory')}</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('loading') || 'Loading...'}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg mb-4">{t('noOrders')}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primaryDark"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/order-tracking/${order._id}`)}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-lg">Order #{order._id.slice(-6)}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          statusColors[order.status]
                        }`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Items Count & Total */}
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{order.items.length} items</p>
                      <p className="text-xl font-bold text-primary">₹{order.total}</p>
                    </div>
                    <span className="text-2xl text-gray-400">→</span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">
                    {order.items.map((item) => item.name).join(', ')}
                  </p>
                </div>

                {/* Address */}
                <p className="text-sm text-gray-600 mt-2">
                  📍 {order.address.address}, {order.address.city}
                </p>
              </div>
            ))}
          </div>
        )}
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

export default OrdersPage;
