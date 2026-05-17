// frontend/src/api/api.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Foods
export const fetchFoods = () => api.get('/api/foods').then((r) => r.data);
export const fetchCategories = () => api.get('/api/foods/categories').then((r) => r.data);

// Cart
export const fetchCart = () => api.get('/api/cart').then((r) => r.data);
export const addToCart = (foodId, quantity = 1) =>
  api.post('/api/cart', { foodId, quantity }).then((r) => r.data);
export const updateCartItem = (foodId, quantity) =>
  api.put(`/api/cart/${foodId}`, { quantity }).then((r) => r.data);
export const removeFromCart = (foodId) =>
  api.delete(`/api/cart/${foodId}`).then((r) => r.data);
export const clearCart = () => api.delete('/api/cart').then((r) => r.data);

// Auth
export const registerUser = (data) =>
  api.post('/api/auth/register', data).then((r) => r.data);

export const loginUser = (data) =>
  api.post('/api/auth/login', data).then((r) => r.data);