import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../api/api';

const CartContext = createContext();

const getSessionId = () => {
  let sid = localStorage.getItem('foodrush_session');
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem('foodrush_session', sid);
  }
  return sid;
};

const calcTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(getSessionId);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCart(sessionId);
      setCart(res.data.data);
    } catch (err) {
      console.error('Failed to load cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = async (food) => {
    try {
      const res = await addToCart(sessionId, {
        foodId: food._id,
        title: food.title,
        price: food.price,
        image: food.image,
        quantity: 1
      });
      setCart(res.data.data);
    } catch (err) {
      console.error('Add to cart failed:', err.message);
    }
  };

  const updateItem = async (foodId, quantity) => {
    try {
      const res = await updateCartItem(sessionId, foodId, quantity);
      setCart(res.data.data);
    } catch (err) {
      console.error('Update cart failed:', err.message);
    }
  };

  const removeItem = async (foodId) => {
    try {
      const res = await removeFromCart(sessionId, foodId);
      setCart(res.data.data);
    } catch (err) {
      console.error('Remove from cart failed:', err.message);
    }
  };

  const emptyCart = async () => {
    try {
      const res = await clearCart(sessionId);
      setCart(res.data.data);
    } catch (err) {
      console.error('Clear cart failed:', err.message);
    }
  };

  const cartCount = cart.items
    ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const cartTotal = cart.items ? calcTotal(cart.items) : 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, addItem, updateItem, removeItem, emptyCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
