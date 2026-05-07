import React, { createContext, useState, useContext, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  const saveCart = useCallback((newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      let updatedCart;

      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity }];
      }

      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      const updatedCart = cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      saveCart(updatedCart);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getTotalQuantity = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalQuantity,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
