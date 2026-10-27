import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Link2, LogOut, Menu, X, User, Shield } from 'lucide-react';

const Navbar = ({ onMenuToggle, sidebarOpen = false }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-colors duration-200" aria-label="Main navigation">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Logo / Left section */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={onMenuToggle}
                className="touch-target p-2 -ml-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                aria-label="Toggle sidebar"
                aria-expanded={sidebarOpen}
                aria-controls="dashboard-sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-600 text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
                <Link2 className="w-5 h-5 rotate-45" />
              </div>
              <span className="text-lg sm:text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                SwiftLink
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/secure-notes"
              state={{ from: isAuthenticated ? 'dashboard' : 'landing' }}
              className={`text-sm font-medium transition-colors ${
                isActive('/secure-notes')
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Secure Notes
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/urls"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/urls')
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  My Links
                </Link>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="touch-target p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200 hover:shadow-[0_0_12px_var(--glow-violet)]"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
                  <User className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {user?.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm flex items-center gap-2 py-2 px-3.5"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-2 transition-colors"
                >
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="touch-target p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-menu" className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 md:hidden p-4 space-y-2 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <Link
            to="/secure-notes"
            state={{ from: isAuthenticated ? 'dashboard' : 'landing' }}
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-xl text-base font-medium transition-colors ${
              isActive('/secure-notes')
                ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400'
                : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Secure Notes
            </span>
          </Link>

          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 text-sm text-slate-500 border-b border-slate-100 dark:border-slate-900">
                Logged in as <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.username}</span>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-base font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/urls"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-base font-medium transition-colors ${
                  isActive('/urls')
                    ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                My Links
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-base font-medium transition-colors ${
                  isActive('/profile')
                    ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10 text-base font-medium transition-colors"
              >
                Sign Out
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-900">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary text-center py-2 text-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-center py-2 text-sm"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
