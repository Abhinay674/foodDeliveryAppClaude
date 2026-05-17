// frontend/src/pages/Cart.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cartItems, onPlaceOrder }) => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    onPlaceOrder();
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {/* ...cart items rendering... */}
      <button
        data-testid="cart-place-order"
        onClick={handlePlaceOrder}
        disabled={cartItems.length === 0}
      >
        Place Order
      </button>
    </div>
  );
};

export default Cart;