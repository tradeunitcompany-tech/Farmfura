import React from 'react';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../hooks/useTranslation';
import { FiX, FiMinus, FiPlus } from 'react-icons/fi';

const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, getSubtotal } = useCart();
  const { t } = useTranslation();
  const deliveryFee = 30;
  const total = getSubtotal() + deliveryFee;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg transform transition-transform z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">{t('cart')}</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-black">
              <FiX size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('noOrders')}</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          ₹{item.price} / {item.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX />
                      </button>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg w-fit">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="px-2 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>

                    {/* Price */}
                    <p className="mt-2 font-semibold text-right">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>{t('subtotal')}</span>
                <span>₹{getSubtotal()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t('deliveryFee')}</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>{t('total')}</span>
                <span>₹{total}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primaryDark transition mt-4"
              >
                {t('proceedToCheckout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
