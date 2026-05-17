// frontend/src/components/Navbar.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">FoodRush</Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-username" data-testid="navbar-username">
              {user.username}
            </span>
            <button
              className="navbar-logout"
              onClick={handleLogout}
              data-testid="navbar-logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" data-testid="navbar-login">Login</Link>
            <Link to="/register" data-testid="navbar-signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;