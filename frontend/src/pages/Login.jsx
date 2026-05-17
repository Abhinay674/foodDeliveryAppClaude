// frontend/src/pages/Login.jsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login, setMessage, message } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Login failed');
      } else {
        login(data.token, data.user, data.message);
        navigate('/');
      }
    } catch (err) {
      setError('Server error');
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit} data-testid="login-form">
        <div>
          <label htmlFor="username">Username</label>
          <input
            data-testid="login-username"
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            data-testid="login-password"
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="auth-error" data-testid="login-error">{error}</div>}
        {message && !error && (
          <div className="auth-success" data-testid="login-success">{message}</div>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <div>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;