import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{item.name}</div>
        <div className="text-xs text-gray-500">{item.category}</div>
        <div className="mt-1 text-sm text-gray-700 font-medium">
          ₹{Math.round(item.price * 83)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center text-lg"
          onClick={() => onDecrease(item)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="w-6 text-center">{item.quantity}</span>
        <button
          className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-lg"
          onClick={() => onIncrease(item)}
        >
          +
        </button>
        <button
          className="ml-2 text-gray-400 hover:text-red-500 transition"
          onClick={() => onRemove(item)}
          title="Remove"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Cart() {
  const { isLoggedIn } = useAuth();
  const {
    cart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartCount,
  } = useCart();
  const navigate = useNavigate();

  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * 83 * item.quantity,
    0
  );
  const deliveryFee = cart.length > 0 ? 249 : 0;
  const gst = Math.round((subtotal + deliveryFee) * 0.05);
  const grandTotal = subtotal + deliveryFee + gst - (promoApplied ? 100 : 0);

  const handleIncrease = item => {
    updateCartItem(item._id, item.quantity + 1);
  };

  const handleDecrease = item => {
    if (item.quantity > 1) {
      updateCartItem(item._id, item.quantity - 1);
    }
  };

  const handleRemove = item => {
    removeFromCart(item._id);
  };

  const handleApplyPromo = e => {
    e.preventDefault();
    if (promo.trim().toLowerCase() === 'foodrush100') {
      setPromoApplied(true);
    }
  };

  const handleOrder = () => {
    clearCart();
    setOrderSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Cart</h2>
          {cart.length === 0 && !orderSuccess && (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="text-5xl mb-4">🛒</span>
              <div className="text-gray-500 mb-2">Your cart is empty.</div>
              <Link
                to="/foods"
                className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition text-sm"
              >
                Browse Foods
              </Link>
            </div>
          )}
          {orderSuccess && (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="text-5xl mb-4">🎉</span>
              <div className="text-green-700 font-semibold mb-2">Order placed successfully!</div>
              <Link
                to="/foods"
                className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full transition text-sm"
              >
                Order More
              </Link>
            </div>
          )}
          {!orderSuccess && cart.length > 0 && (
            <div>
              {cart.map(item => (
                <CartItem
                  key={item._id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>
        {/* Order Summary */}
        <div className="w-full md:w-80 bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Order Summary</h3>
          <div className="flex justify-between text-sm text-gray-700">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span>GST (5%)</span>
            <span>₹{gst}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-sm text-green-700 font-semibold">
              <span>Promo Applied</span>
              <span>-₹100</span>
            </div>
          )}
          <form onSubmit={handleApplyPromo} className="flex gap-2 mt-2">
            <input
              type="text"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="Promo code"
              value={promo}
              onChange={e => setPromo(e.target.value)}
              disabled={promoApplied}
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition disabled:bg-orange-300"
              disabled={promoApplied || !promo.trim()}
            >
              {promoApplied ? 'Applied' : 'Apply'}
            </button>
          </form>
          <div className="border-t border-gray-100 my-2"></div>
          <div className="flex justify-between text-lg font-bold text-gray-800">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>
          {!isLoggedIn && cart.length > 0 && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-sm text-orange-700 mb-2">
              Please log in to place an order
            </div>
          )}
          <button
            className={`w-full mt-2 py-3 rounded-xl text-white font-semibold text-sm transition ${
              cart.length === 0
                ? 'bg-gray-200 cursor-not-allowed'
                : isLoggedIn
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-orange-400 hover:bg-orange-500'
            }`}
            disabled={cart.length === 0}
            onClick={() => {
              if (!isLoggedIn) {
                navigate('/login', { state: { from: '/cart' } });
              } else {
                handleOrder();
              }
            }}
          >
            {isLoggedIn
              ? `Place Order · ₹${grandTotal}`
              : 'Login to Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}