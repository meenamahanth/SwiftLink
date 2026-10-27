import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, LogIn, Lock, Mail, Eye, EyeOff, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Display alert toast if session expired
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      toast.error('Your login session has expired. Please sign in again.', { id: 'session-expiry' });
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.usernameOrEmail || !formData.password) {
      toast.error('Please enter all credentials');
      return;
    }

    setLoading(true);
    try {
      await login(formData.usernameOrEmail.trim(), formData.password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(typeof err === 'string' ? err : 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 flex items-center justify-center p-3 sm:p-4 overflow-x-hidden">
      {/* Background glow elements */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-900/10"></div>

      <div className="w-full max-w-md">
        {/* Brand Logo Header */}
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
            Welcome back
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Access your premium link dashboard and analytics panel
          </p>
        </div>

        {/* Form Container Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Sign in form">
            {/* Username / Email */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Username or Email
              </label>
              <input
                type="text"
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                placeholder="e.g. janesmith or jane@example.com"
                className="input-field"
                required
                disabled={loading}
              />
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
                  placeholder="Enter secure password"
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 min-h-[44px]"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Registration link footer */}
          <div className="text-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-violet-600 dark:text-violet-400 hover:underline font-semibold"
              >
                Sign up free
              </Link>
            </span>
          </div>
        </div>

        {/* Back to Home Button in Center */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl border border-slate-250 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all text-xs font-bold shadow-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:border-violet-500/40 dark:hover:border-violet-500/50 hover:scale-103"
          >
            <Home className="w-4 h-4 text-violet-500" />
            Back to Home page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
