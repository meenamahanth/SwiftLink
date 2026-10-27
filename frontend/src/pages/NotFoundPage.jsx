import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 flex items-center justify-center p-4">
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-900/5"></div>

      <div className="text-center max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-500/20">
            <Link2 className="w-6.5 h-6.5 rotate-45" />
          </div>
          <span className="text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            SwiftLink
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-5xl sm:text-7xl font-extrabold tracking-widest text-slate-200 dark:text-slate-800 block">404</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
            Page Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2 text-sm">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
