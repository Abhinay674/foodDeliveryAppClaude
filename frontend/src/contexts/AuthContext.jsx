// frontend/src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('foodrush_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('foodrush_token'));
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('foodrush_token', token);
      localStorage.setItem('foodrush_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('foodrush_token');
      localStorage.removeItem('foodrush_user');
    }
  }, [token, user]);

  const login = (token, user, message) => {
    setToken(token);
    setUser(user);
    setMessage(message || '');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setMessage('');
    localStorage.removeItem('foodrush_token');
    localStorage.removeItem('foodrush_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, message, setMessage }}>
      {children}
    </AuthContext.Provider>
  );
}