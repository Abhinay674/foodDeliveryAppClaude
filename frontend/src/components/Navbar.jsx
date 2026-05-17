import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ searchQuery, setSearchQuery }) {
  const { user, isLoggedIn, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = e => {
    e.preventDefault();
    navigate(`/foods?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center gap-1">
            <span
              className="text-2xl font-bold"
              style={{ color: '#FF5200' }}
            >
              Food
            </span>
            <span className="text-2xl font-bold text-gray-800">Rush</span>
          </Link>
        </div>
        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <form onSubmit={handleSearch}>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              className="w-full rounded-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-400"
              placeholder="Search foods, cuisines..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        {/* Support Button */}
        <div className="flex-shrink-0">
          <Link
            to="/support"
            className="border-2 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1"
            style={{ borderColor: '#FF5200', color: '#FF5200' }}
          >
            <span>🤖</span>
            <span>Support</span>
          </Link>
        </div>
        {/* Auth Section */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <span className="flex items-center text-sm text-gray-600">
                👤 {user?.username}
              </span>
              <button
                className="text-sm border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm rounded-full px-4 py-1.5 text-white"
                style={{ backgroundColor: '#FF5200' }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
        {/* Cart Button */}
        <div className="flex-shrink-0 relative">
          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-white"
            style={{ backgroundColor: '#FF5200' }}
          >
            <span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h14l-2-9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-orange-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border border-orange-200">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}