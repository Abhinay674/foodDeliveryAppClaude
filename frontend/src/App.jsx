import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FoodListing from './pages/FoodListing';
import Cart from './pages/Cart';
import Support from './pages/Support';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/foods"
                element={
                  <FoodListing
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                }
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/support" element={<Support />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
