import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AddressesPage from './pages/AddressesPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import RegisterPage from './pages/RegisterPage';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LocationProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/addresses" element={<AddressesPage />} />
            <Route path="/account-settings" element={<AccountSettingsPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
      </LocationProvider>
    </BrowserRouter>
  );
}

export default App;
