import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      showSuccess('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h2>Create Account</h2>
      <p className="subtitle">Join WhatBytes Healthcare</p>

      {apiError && <div className="api-error">{apiError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="John Doe"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <div className="error-text">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="you@example.com"
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <div className="error-text">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <div className="password-wrapper">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              placeholder="At least 6 characters"
              className={errors.password ? 'input-error' : ''}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <div className="error-text">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <div className="password-wrapper">
            <input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Re-enter your password"
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <LoadingSpinner small /> : <><UserPlus size={16} /> Create Account</>}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
