// frontend/src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api';
import { useAuth } from '../context/AuthContext';

const ORANGE = '#FF5200';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.user, res.token);
      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate('/foods');
      }, 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: ORANGE }}
        >
          FoodRush Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              minLength={3}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              minLength={6}
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm font-medium">{error}</div>
          )}
          {successMsg && (
            <div
              className="text-center text-white rounded py-2 px-3 mb-2"
              style={{ background: ORANGE }}
            >
              {successMsg}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 rounded text-white font-semibold"
            style={{
              background: ORANGE,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <button
            className="font-semibold"
            style={{ color: ORANGE }}
            onClick={() => navigate('/register')}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;