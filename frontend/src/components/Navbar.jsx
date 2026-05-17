// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ORANGE = '#FF5200';

const CartIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke={ORANGE}
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path
      d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
  </svg>
);

const Navbar = () => {
  const { cartItems } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span
            className="text-2xl font-bold"
            style={{ color: ORANGE }}
          >
            FoodRush
          </span>
        </Link>
        <div className="relative ml-4">
          <input
            type="text"
            placeholder="Search foods..."
            className="pl-9 pr-3 py-1.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            style={{ minWidth: 180 }}
            disabled
          />
          <span className="absolute left-2 top-2 text-gray-400">
            <SearchIcon />
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="px-3 py-1 rounded font-medium border border-orange-500 text-orange-500 hover:bg-orange-50 transition"
          onClick={() => navigate('/support')}
        >
          Support
        </button>
        <button
          className="relative flex items-center px-3 py-1 rounded font-medium border border-orange-500 text-orange-500 hover:bg-orange-50 transition"
          onClick={() => navigate('/cart')}
        >
          <CartIcon />
          <span className="ml-2">Cart</span>
          {cartItems.length > 0 && (
            <span
              className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5"
              style={{ minWidth: 20, textAlign: 'center' }}
            >
              {cartItems.length}
            </span>
          )}
        </button>
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700 flex items-center">
              <span className="mr-1">👤</span>
              {user?.username}
            </span>
            <button
              className="px-3 py-1 rounded font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1 rounded font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Login
            </Link>
            <button
              className="px-3 py-1 rounded font-medium text-white"
              style={{ background: ORANGE }}
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;