const getApiBase = () => {
  // Check for Vite
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.endsWith('/api') 
      ? import.meta.env.VITE_API_URL 
      : `${import.meta.env.VITE_API_URL}/api`;
  }
  // Check for CRA
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.endsWith('/api')
      ? process.env.REACT_APP_API_URL
      : `${process.env.REACT_APP_API_URL}/api`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBase();

export const apiCall = async (method, endpoint, data = null, token = null) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'API Error');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Auth APIs
export const sendOTP = async (phone) => {
  return apiCall('POST', '/auth/send-otp', { phone });
};

export const verifyOTP = async (phone, otp) => {
  return apiCall('POST', '/auth/verify-otp', { phone, otp });
};

export const emailRegister = async (userData) => {
  return apiCall('POST', '/auth/register', userData);
};

export const emailLogin = async (email, password) => {
  return apiCall('POST', '/auth/login', { email, password });
};

// Products API
export const getProducts = async (category = null, search = null) => {
  let query = '';
  if (category) query += `?category=${category}`;
  if (search) query += `${query ? '&' : '?'}search=${search}`;
  return apiCall('GET', `/products${query}`);
};

export const getProduct = async (id) => {
  return apiCall('GET', `/products/${id}`);
};

// Orders API
export const createOrder = async (orderData, token) => {
  return apiCall('POST', '/orders', orderData, token);
};

export const getUserOrders = async (userId, token) => {
  return apiCall('GET', `/orders/user/${userId}`, null, token);
};

export const getOrderStatus = async (orderId) => {
  return apiCall('GET', `/orders/status/${orderId}`);
};

// Users API
export const getUser = async (userId, token) => {
  return apiCall('GET', `/users/${userId}`, null, token);
};

export const addAddress = async (userId, addressData, token) => {
  return apiCall('POST', `/users/${userId}/address`, addressData, token);
};

export const updateUser = async (userId, userData, token) => {
  return apiCall('PUT', `/users/${userId}`, userData, token);
};
