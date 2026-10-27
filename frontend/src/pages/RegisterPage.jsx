import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, UserPlus, Lock, Mail, User, Eye, EyeOff, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset field errors
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    // Validations
    let errs = {};
    if (formData.username.length < 3) errs.username = 'Username must be at least 3 characters';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Please provide a valid email';
    if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await register(formData.username.trim(), formData.email.trim(), formData.password);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      if (typeof err === 'object') {
        setFieldErrors(err);
      } else {
        toast.error(err || 'Registration failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 flex items-center justify-center p-3 sm:p-4 overflow-x-hidden">
      {/* Background glow elements */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-900/10"></div>

      <div className="w-full max-w-md">
        {/* Header logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 group justify-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-600 text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <Link2 className="w-5.5 h-5.5 rotate-45" />
            </div>
            <span className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              SwiftLink
            </span>
          </Link>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-4">
            Create an account
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Sign up now and unlock real-time link analytics features
          </p>
        </div>

        {/* Card Form */}
        <div className="glass-card rounded-2xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Registration form">
            {/* Username */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. janesmith"
                className="input-field"
                required
                disabled={loading}
              />
              {fieldErrors.username && (
                <p className="text-[10px] text-red-500 font-semibold mt-1">{fieldErrors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. jane@example.com"
                className="input-field"
                required
                disabled={loading}
              />
              {fieldErrors.email && (
                <p className="text-[10px] text-red-500 font-semibold mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="input-field pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="touch-target absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 transition-colors"
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[10px] text-red-500 font-semibold mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 min-h-[44px]"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Login redirection link */}
          <div className="text-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-violet-600 dark:text-violet-400 hover:underline font-semibold"
              >
                Sign in instead
              </Link>
            </span>
          </div>
        </div>

        {/* Back to Home Button in Center */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl border border-slate-255 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all text-xs font-bold shadow-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:border-violet-500/40 dark:hover:border-violet-500/50 hover:scale-103"
          >
            <Home className="w-4 h-4 text-violet-500" />
            Back to Home page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
