// frontend/src/pages/Cart.jsx

import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ORANGE = '#FF5200';

const CartItem = ({ item, onRemove, onUpdate }) => (
  <div className="flex items-center justify-between py-3 border-b">
    <div className="flex items-center gap-4">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div>
        <div className="font-semibold">{item.name}</div>
        <div className="text-gray-500 text-sm">{item.category}</div>
        <div className="text-gray-700 font-medium">${item.price.toFixed(2)}</div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        className="px-2 py-1 rounded bg-gray-200"
        onClick={() => onUpdate(item._id, Math.max(1, item.quantity - 1))}
        disabled={item.quantity <= 1}
      >
        -
      </button>
      <span className="px-2">{item.quantity}</span>
      <button
        className="px-2 py-1 rounded bg-gray-200"
        onClick={() => onUpdate(item._id, item.quantity + 1)}
      >
        +
      </button>
      <button
        className="ml-3 px-2 py-1 rounded bg-red-100 text-red-600 text-xs"
        onClick={() => onRemove(item._id)}
      >
        Remove
      </button>
    </div>
  </div>
);

const Cart = () => {
  const {
    cartItems,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleOrder = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    // Place order logic here (not implemented)
    clearCart();
    alert('Order placed! Thank you for ordering with FoodRush 🍔');
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6" style={{ color: ORANGE }}>
        Your Cart
      </h2>
      {cartItems.length === 0 ? (
        <div className="text-gray-500 text-center py-12">
          Your cart is empty. <button className="text-orange-500 underline" onClick={() => navigate('/foods')}>Browse foods</button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded shadow p-4 mb-6">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onRemove={removeFromCart}
                onUpdate={updateCartItem}
              />
            ))}
            <div className="flex justify-between items-center mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
                onClick={clearCart}
              >
                Clear All
              </button>
              <div className="text-lg font-semibold">
                Total:{' '}
                <span style={{ color: ORANGE }}>
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            {!isLoggedIn && (
              <div
                className="mb-2 px-4 py-2 rounded text-white text-sm"
                style={{ background: ORANGE }}
              >
                Please log in to place an order
              </div>
            )}
            <button
              className="px-6 py-2 rounded text-white font-semibold"
              style={{
                background: ORANGE,
                opacity: cartItems.length === 0 ? 0.6 : 1,
                cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
              }}
              disabled={cartItems.length === 0}
              onClick={handleOrder}
            >
              {isLoggedIn ? 'Place Order' : 'Login to Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;