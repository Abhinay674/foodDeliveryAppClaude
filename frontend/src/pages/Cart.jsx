import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart();
  const [updating, setUpdating] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleUpdate = async (newQty) => {
    setUpdating(true);
    if (newQty <= 0) {
      await removeItem(item.foodId);
    } else {
      await updateItem(item.foodId, newQty);
    }
    setUpdating(false);
  };

  return (
    <div className="bg-white rounded-2xl p-4 flex gap-4 items-center shadow-sm">
      <img
        src={imgError ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=150&fit=crop' : item.image}
        alt={item.title}
        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
        onError={() => setImgError(true)}
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight truncate">{item.title}</h3>
        <p className="text-gray-500 text-xs mt-0.5">₹{(item.price * 83).toFixed(0)} each</p>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdate(item.quantity - 1)}
              disabled={updating}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all hover:bg-orange-50 disabled:opacity-50"
              style={{ borderColor: '#FF5200', color: '#FF5200' }}
            >
              -
            </button>
            <span className="w-6 text-center font-semibold text-gray-800 text-sm">
              {updating ? '·' : item.quantity}
            </span>
            <button
              onClick={() => handleUpdate(item.quantity + 1)}
              disabled={updating}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all hover:bg-orange-50 disabled:opacity-50"
              style={{ borderColor: '#FF5200', color: '#FF5200' }}
            >
              +
            </button>
          </div>

          {/* Item total + remove */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-800">
              ₹{(item.price * item.quantity * 83).toFixed(0)}
            </span>
            <button
              onClick={() => removeItem(item.foodId)}
              className="text-red-400 hover:text-red-500 transition-colors"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const { cart, loading, cartTotal, emptyCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [ordered, setOrdered] = useState(false);

  const handleOrder = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    await emptyCart();
    setOrdered(true);
  };

  const deliveryFee = cartTotal > 0 ? 2.99 : 0;
  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + deliveryFee + tax;

  if (loading) return <LoadingSpinner message="Loading your cart..." />;

  if (ordered) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
        <p className="text-gray-500 mb-8">
          Your food is being prepared and will be delivered shortly.
        </p>
        <button
          onClick={() => { setOrdered(false); navigate('/'); }}
          className="text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition"
          style={{ backgroundColor: '#FF5200' }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/foods"
          className="inline-block text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition"
          style={{ backgroundColor: '#FF5200' }}
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Your Cart
          <span className="ml-2 text-base font-normal text-gray-400">
            ({cart.items.length} item{cart.items.length !== 1 ? 's' : ''})
          </span>
        </h1>
        <button
          onClick={emptyCart}
          className="text-sm text-red-400 hover:text-red-500 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Items List */}
        <div className="flex-1 flex flex-col gap-3">
          {cart.items.map((item) => (
            <CartItem key={item.foodId || item._id} item={item} />
          ))}

          <Link
            to="/foods"
            className="text-center text-sm font-medium mt-2 block hover:underline"
            style={{ color: '#FF5200' }}
          >
            + Add more items
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-20">
            <h2 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{(cartTotal * 83).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₹{(deliveryFee * 83).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span>₹{(tax * 83).toFixed(0)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-base">
                <span>Total</span>
                <span>₹{(grandTotal * 83).toFixed(0)}</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 border border-gray-200 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:border-orange-300"
                />
                <button
                  className="px-4 py-1.5 rounded-full text-sm font-medium border-2 transition hover:bg-orange-50"
                  style={{ borderColor: '#FF5200', color: '#FF5200' }}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Login nudge when not logged in */}
            {!isLoggedIn && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-700 text-center">
                <span className="font-medium">Please log in to place an order</span>
              </div>
            )}

            <button
              onClick={handleOrder}
              className="w-full mt-4 text-white font-bold py-3.5 rounded-full transition-all hover:opacity-90 active:scale-95 shadow-md"
              style={{ backgroundColor: '#FF5200' }}
            >
              {isLoggedIn
                ? `Place Order · ₹${(grandTotal * 83).toFixed(0)}`
                : 'Login to Place Order'}
            </button>

            {isLoggedIn && (
              <p className="text-xs text-gray-400 text-center mt-3">
                🔒 Safe & secure checkout
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
