import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export const fetchFoods = (params) => api.get('/api/foods', { params });
export const fetchCategories = () => api.get('/api/foods/categories');

export const fetchCart = (sessionId) => api.get(`/api/cart/${sessionId}`);
export const addToCart = (sessionId, item) => api.post(`/api/cart/${sessionId}`, item);
export const updateCartItem = (sessionId, foodId, quantity) =>
  api.put(`/api/cart/${sessionId}/${foodId}`, { quantity });
export const removeFromCart = (sessionId, foodId) =>
  api.delete(`/api/cart/${sessionId}/${foodId}`);
export const clearCart = (sessionId) => api.delete(`/api/cart/${sessionId}`);

export default api;
