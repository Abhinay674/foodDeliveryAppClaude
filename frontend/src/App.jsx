import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FoodListing from './pages/FoodListing';
import Cart from './pages/Cart';
import Support from './pages/Support';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
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
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
