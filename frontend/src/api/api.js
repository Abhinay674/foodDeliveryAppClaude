import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  response => response,
  error => {
    // Log errors for debugging
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Existing functions
export const fetchFoods = params => api.get('/api/foods', { params }).then(r => r.data);
export const fetchCategories = () => api.get('/api/foods/categories').then(r => r.data);

export const fetchCart = token =>
  api.get('/api/cart', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const addToCart = (foodId, quantity, token) =>
  api.post(
    '/api/cart',
    { foodId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  ).then(r => r.data);

export const updateCartItem = (foodId, quantity, token) =>
  api.put(
    `/api/cart/${foodId}`,
    { quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  ).then(r => r.data);

export const removeFromCart = (foodId, token) =>
  api.delete(`/api/cart/${foodId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

export const clearCart = token =>
  api.delete('/api/cart', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);

// New auth functions
export const registerUser = data =>
  api.post('/api/auth/register', data).then(r => r.data);

export const loginUser = data =>
  api.post('/api/auth/login', data).then(r => r.data);