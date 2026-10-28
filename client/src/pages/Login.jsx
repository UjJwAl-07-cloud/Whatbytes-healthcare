import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email';
    }
    if (!password) {
      errs.password = 'Password is required';
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
      await login(email, password);
      showSuccess('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Please check your credentials.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Welcome Back</h2>
      <p className="subtitle">Sign in to your account</p>

      {apiError && <div className="api-error">{apiError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <div className="error-text">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <LoadingSpinner small /> : <><LogIn size={16} /> Sign In</>}
        </button>
      </form>

      <div className="auth-footer">
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
