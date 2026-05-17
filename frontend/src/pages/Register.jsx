// frontend/src/pages/Register.jsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { login, setMessage } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Registration failed');
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
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} data-testid="register-form">
        <div>
          <label htmlFor="username">Username</label>
          <input
            data-testid="register-username"
            type="text"
            id="username"
            name="username"
            minLength={3}
            value={form.username}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            data-testid="register-password"
            type="password"
            id="password"
            name="password"
            minLength={6}
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            data-testid="register-confirmPassword"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            minLength={6}
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="auth-error" data-testid="register-error">{error}</div>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Registering...' : 'Sign Up'}
        </button>
      </form>
      <div>
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
};

export default Register;