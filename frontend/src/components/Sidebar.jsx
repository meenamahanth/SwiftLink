import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Link2,
  Plus,
  List,
  BarChart3,
  Shield,
  User,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 ${
      isActive
        ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400 font-semibold shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/50'
    }`;

  const subLinkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-250 ml-3 ${
      isActive
        ? 'text-violet-600 dark:text-violet-400 font-semibold'
        : 'text-slate-500 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300'
    }`;

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard navigation"
        className={`fixed top-14 sm:top-16 bottom-0 left-0 z-30 w-64 max-w-[85vw] border-r border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md p-4 transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-6">
            <NavLink to="/dashboard" onClick={onClose} className={navLinkClass}>
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </NavLink>

            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-2">
                URL Shortener
              </p>
              <div className="space-y-0.5">
                <NavLink to="/dashboard" onClick={onClose} className={subLinkClass}>
                  <Plus className="w-3.5 h-3.5" />
                  Create URL
                </NavLink>
                <NavLink to="/urls" onClick={onClose} className={subLinkClass}>
                  <List className="w-3.5 h-3.5" />
                  My URLs
                </NavLink>
                <NavLink to="/urls" onClick={onClose} className={subLinkClass}>
                  <BarChart3 className="w-3.5 h-3.5" />
                  Analytics
                </NavLink>
              </div>
            </div>

            {/* Secure Notes — public tool, opens standalone page */}
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-2">
                Secure Notes
              </p>
              <NavLink
                to="/secure-notes"
                state={{ from: 'dashboard' }}
                onClick={onClose}
                className={subLinkClass}
              >
                <Shield className="w-3.5 h-3.5" />
                Secure Notes
              </NavLink>
            </div>

            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-2">
                Profile
              </p>
              <NavLink to="/profile" onClick={onClose} className={subLinkClass}>
                <User className="w-3.5 h-3.5" />
                Settings
              </NavLink>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-350 flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-violet-500" />
                End-to-End Encryption
              </span>
              Secure Notes are encrypted in your browser. No Secret Code is ever stored.
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors min-h-[44px]"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
