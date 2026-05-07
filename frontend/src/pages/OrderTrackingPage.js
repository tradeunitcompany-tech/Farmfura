import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { getOrderStatus } from '../utils/api';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Toast from '../components/Toast';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getOrderStatus(orderId);
        setOrder(response.order);

        // Poll for updates
        const interval = setInterval(async () => {
          const updated = await getOrderStatus(orderId);
          setOrder(updated.order);
        }, 3000);

        return () => clearInterval(interval);
      } catch (error) {
        setToast({ message: 'Failed to load order', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">{t('loading') || 'Loading...'}</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Order not found</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-white px-6 py-2 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const statuses = ['searching', 'assigned', 'on_the_way', 'delivered'];
  const currentStatusIndex = statuses.indexOf(order.status);

  const statusLabels = {
    searching: t('searching'),
    assigned: t('assigned'),
    on_the_way: t('onTheWay'),
    delivered: t('delivered'),
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600">{t('trackOrder')}</p>
              <h1 className="text-2xl font-bold">{t('orderConfirmed')}</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono text-sm">{orderId}</p>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-6">{t('orderStatus')}</h2>

          <div className="space-y-4">
            {statuses.map((status, index) => (
              <div key={status} className="flex items-start">
                {/* Timeline circle */}
                <div className="flex flex-col items-center mr-6">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index <= currentStatusIndex ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    {index < currentStatusIndex ? '✓' : index + 1}
                  </div>
                  {index < statuses.length - 1 && (
                    <div
                      className={`w-1 h-12 ${
                        index < currentStatusIndex ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>

                {/* Status info */}
                <div className="pt-2">
                  <p className={`font-semibold ${index <= currentStatusIndex ? 'text-gray-800' : 'text-gray-500'}`}>
                    {statusLabels[status]}
                  </p>
                  {index <= currentStatusIndex && (
                    <p className="text-sm text-gray-600">
                      {status === order.status && 'In progress...'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrier Info */}
        {order.carrier && (order.status === 'assigned' || order.status === 'on_the_way') && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{t('carrier')}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('carrier')}</p>
                <p className="font-semibold text-lg">{order.carrier.name}</p>
                <p className="text-sm text-gray-600">{order.carrier.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">{t('vehicle')}</p>
                <p className="font-semibold text-lg">{order.carrier.vehicle}</p>
                <p className="text-sm text-yellow-600">⭐ {order.carrier.rating}</p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-4 bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-600">🗺️ Map will show real-time location</p>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} {item.unit} × ₹{item.price}
                  </p>
                </div>
                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
            <span>{t('total')}</span>
            <span className="text-primary">₹{order.total}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primaryDark transition"
          >
            View All Orders
          </button>
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

export default OrderTrackingPage;
