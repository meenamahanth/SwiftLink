import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Link2,
  Sparkles,
  BarChart3,
  QrCode,
  Zap,
  ArrowRight,
  Lock,
  Shield,
  Eye,
  Clock,
  Compass,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 flex flex-col justify-between overflow-x-hidden">
      {/* Global Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 sm:py-16 px-3 sm:px-6 lg:px-8">
        {/* Ambient glow effects */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-900/5"></div>
        <div className="absolute top-1/3 right-1/4 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-900/5"></div>

        <div className="mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/30 text-xs font-semibold mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            SwiftLink v2.0
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.15] text-slate-950 dark:text-white mb-4 tracking-tight px-2">
            SwiftLink <br />
            <span className="gradient-text">Securely Share Links & Notes</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8 sm:mb-12 px-2">
            Simplify your redirection workflows and protect your secrets with military-grade client-side encryption. Two industry-grade products, one single platform.
          </p>

          {/* Dual Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto text-left">
            
            {/* Product 1: URL Shortener */}
            <div className="glass-card group relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 hover:border-violet-500/50 dark:hover:border-violet-500/50 hover-glow transition-all duration-300 flex flex-col justify-between bg-white/40 dark:bg-slate-900/20 backdrop-blur-md min-w-0">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6 border border-violet-100 dark:border-violet-900/40">
                  <Link2 className="w-6 h-6 rotate-45" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  URL Shortener
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Generate simple, short links with dynamic targets, custom aliases, and robust access management.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2.5 text-xs text-slate-650 dark:text-slate-350">
                    <QrCode className="w-4 h-4 text-violet-500" />
                    <span>Create Custom QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-650 dark:text-slate-350">
                    <BarChart3 className="w-4 h-4 text-violet-500" />
                    <span>Track Analytics in Real-Time</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-650 dark:text-slate-350">
                    <Zap className="w-4 h-4 text-violet-500" />
                    <span>Instant Millisecond Redirection</span>
                  </li>
                </ul>
              </div>

              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary w-full py-3 flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link to="/register" className="btn-primary w-full py-3 flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all">
                  Shorten URL
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Product 2: Secure Notes */}
            <div className="glass-card group relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover-glow transition-all duration-300 flex flex-col justify-between bg-white/40 dark:bg-slate-900/20 backdrop-blur-md min-w-0">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-450 flex items-center justify-center mb-6 border border-cyan-100 dark:border-cyan-900/40">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Secure Notes
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Store end-to-end encrypted temporary notes protected by client-side AES-256 keys derived from your secret codes.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2.5 text-xs text-slate-650 dark:text-slate-350">
                    <Shield className="w-4 h-4 text-cyan-500" />
                    <span>Store End-to-End Encrypted Notes</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-650 dark:text-slate-350">
                    <Eye className="w-4 h-4 text-cyan-500" />
                    <span>100% Anonymous (No account needed)</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-650 dark:text-slate-350">
                    <Clock className="w-4 h-4 text-cyan-500" />
                    <span>Temporary with customizable expiry</span>
                  </li>
                </ul>
              </div>

              <Link to="/secure-notes" state={{ from: 'landing' }} className="btn-secondary w-full py-3 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all border-none">
                Open Secure Notes
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Board */}
      <section className="py-8 sm:py-12 px-3 sm:px-4">
        <div className="mx-auto max-w-5xl rounded-2xl sm:rounded-3xl bg-gradient-to-r from-violet-900 to-indigo-950 p-6 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent)]"></div>
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            <div className="pb-6 sm:pb-0">
              <span className="text-3xl sm:text-5xl font-extrabold font-display text-white">99.99%</span>
              <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-semibold">Redirection Uptime</p>
            </div>
            <div className="pt-6 sm:pt-0">
              <span className="text-4xl sm:text-5xl font-extrabold font-display text-white">10M+</span>
              <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-semibold">Links Shortened</p>
            </div>
            <div className="pt-6 sm:pt-0">
              <span className="text-4xl sm:text-5xl font-extrabold font-display text-white">&lt; 15ms</span>
              <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-semibold">Response latency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
