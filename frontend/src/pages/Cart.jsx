import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

// ─── Icons ────────────────────────────────────────────────────────────────────

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// ─── Cart Item Row ─────────────────────────────────────────────────────────────

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart();
  const [updating, setUpdating] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const FALLBACK_IMG =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=150&fit=crop';

  const handleQty = async (newQty) => {
    setUpdating(true);
    try {
      if (newQty <= 0) await removeItem(item.foodId);
      else await updateItem(item.foodId, newQty);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex gap-4 items-center p-4 bg-white rounded-2xl shadow-sm">
      <img
        src={imgErr ? FALLBACK_IMG : item.image}
        alt={item.title}
        onError={() => setImgErr(true)}
        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug truncate">
          {item.title}
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">
          ₹{Math.round(item.price * 83)} each
        </p>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQty(item.quantity - 1)}
              disabled={updating}
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-lg
                         transition hover:bg-orange-50 disabled:opacity-40"
              style={{ borderColor: '#FF5200', color: '#FF5200' }}
            >
              −
            </button>
            <span className="w-5 text-center text-sm font-semibold text-gray-800">
              {updating ? '·' : item.quantity}
            </span>
            <button
              onClick={() => handleQty(item.quantity + 1)}
              disabled={updating}
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-lg
                         transition hover:bg-orange-50 disabled:opacity-40"
              style={{ borderColor: '#FF5200', color: '#FF5200' }}
            >
              +
            </button>
          </div>

          {/* Line total + remove */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-800 text-sm">
              ₹{Math.round(item.price * item.quantity * 83)}
            </span>
            <button
              onClick={() => removeItem(item.foodId)}
              aria-label="Remove item"
              className="text-red-300 hover:text-red-500 transition"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Cart Page ───────────────────────────────────────────────────────────

export default function Cart() {
  const { cart, loading, cartTotal, emptyCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [promo, setPromo]               = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError]     = useState('');
  const [ordered, setOrdered]           = useState(false);

  const items = cart?.items ?? [];

  const subtotal    = cartTotal;                           // already in USD from context
  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const gst         = subtotal * 0.05;
  const discount    = promoApplied ? 1.2 : 0;             // ~₹100 equivalent
  const grandTotal  = subtotal + deliveryFee + gst - discount;

  const fmt = (usd) => `₹${Math.round(usd * 83)}`;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promo.trim().toUpperCase() === 'FOODRUSH100') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    await emptyCart();
    setOrdered(true);
  };

  // ── Loading ──
  if (loading) return <LoadingSpinner message="Loading your cart…" />;

  // ── Order success ──
  if (ordered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your food is being prepared and will arrive soon.
          </p>
          <button
            onClick={() => { setOrdered(false); navigate('/'); }}
            className="w-full py-3 rounded-full text-white font-semibold transition hover:opacity-90"
            style={{ backgroundColor: '#FF5200' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm w-full">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/foods"
            className="inline-block w-full py-3 rounded-full text-white font-semibold text-center transition hover:opacity-90"
            style={{ backgroundColor: '#FF5200' }}
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  // ── Cart with items ──
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Your Cart
            <span className="ml-2 text-base font-normal text-gray-400">
              ({items.length} item{items.length !== 1 ? 's' : ''})
            </span>
          </h1>
          <button
            onClick={emptyCart}
            className="text-sm text-red-400 hover:text-red-500 font-medium transition"
          >
            Clear All
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Items list ── */}
          <div className="flex-1 flex flex-col gap-3">
            {items.map((item) => (
              <CartItem key={item.foodId ?? item._id} item={item} />
            ))}
            <Link
              to="/foods"
              className="text-center text-sm font-medium mt-1 block hover:underline"
              style={{ color: '#FF5200' }}
            >
              + Add more items
            </Link>
          </div>

          {/* ── Order summary panel ── */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h2>

              {/* Price breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{fmt(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span>{fmt(gst)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Promo (FOODRUSH100)</span>
                    <span>−{fmt(discount)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-base">
                  <span>Total</span>
                  <span>{fmt(grandTotal)}</span>
                </div>
              </div>

              {/* Promo code */}
              {!promoApplied && (
                <form onSubmit={handleApplyPromo} className="mt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promo}
                      onChange={(e) => { setPromo(e.target.value); setPromoError(''); }}
                      placeholder="Promo code"
                      className="flex-1 border border-gray-200 rounded-full px-3 py-1.5 text-sm
                                 focus:outline-none focus:border-orange-300 transition"
                    />
                    <button
                      type="submit"
                      disabled={!promo.trim()}
                      className="px-4 py-1.5 rounded-full text-sm font-medium border-2 transition
                                 hover:bg-orange-50 disabled:opacity-40"
                      style={{ borderColor: '#FF5200', color: '#FF5200' }}
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-red-500 text-xs mt-1.5">{promoError}</p>
                  )}
                </form>
              )}

              {/* Login nudge */}
              {!isLoggedIn && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-xl
                                text-sm text-orange-700 text-center">
                  Please log in to place your order
                </div>
              )}

              {/* Place Order / Login button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-4 py-3.5 rounded-full text-white font-semibold text-sm
                           transition hover:opacity-90 active:scale-95 shadow-md"
                style={{ backgroundColor: '#FF5200' }}
              >
                {isLoggedIn
                  ? `Place Order · ${fmt(grandTotal)}`
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
    </div>
  );
}
