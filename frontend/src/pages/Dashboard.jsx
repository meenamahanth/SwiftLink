import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { TimelineChart } from '../components/AnalyticsChart';
import {
  Link2,
  MousePointerClick,
  Plus,
  ArrowRight,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  Download,
  QrCode,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, activeLinks: 0, expiredLinks: 0 });
  const [clicksData, setClicksData] = useState([]);
  const [topUrls, setTopUrls] = useState([]);
  const [recentUrls, setRecentUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Shortener state
  const [longUrl, setLongUrl] = useState('');
  const [shortening, setShortening] = useState(false);
  const [quickResult, setQuickResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrLoading, setQrLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, clicksRes, topUrlsRes, urlsRes] = await Promise.all([
        api.get('/api/analytics/dashboard'),
        api.get('/api/analytics/clicks-by-day?days=7'),
        api.get('/api/analytics/top-urls'),
        api.get('/api/urls'),
      ]);

      setStats(statsRes.data);
      setClicksData(clicksRes.data);
      setTopUrls(topUrlsRes.data);
      setRecentUrls(urlsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) return;

    // Standard URL Validation
    try {
      new URL(longUrl);
    } catch (_) {
      toast.error('Please enter a valid URL including http:// or https://');
      return;
    }

    setShortening(true);
    setQuickResult(null);
    setQrCodeUrl('');
    try {
      const response = await api.post('/api/urls', { longUrl: longUrl.trim() });
      const result = response.data;
      setQuickResult(result);
      setLongUrl('');

      // Fetch QR code
      setQrLoading(true);
      try {
        const qrResponse = await api.get(`/api/urls/${result.id}/qrcode`, { responseType: 'blob' });
        const blob = new Blob([qrResponse.data], { type: 'image/png' });
        setQrCodeUrl(URL.createObjectURL(blob));
      } catch (qrErr) {
        console.error('Error fetching QR code:', qrErr);
      }
      setQrLoading(false);

      toast.success('URL shortened successfully!');
      
      // Refresh statistics and list
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setShortening(false);
    }
  };

  // Cleanup QR object URL on unmount
  useEffect(() => {
    return () => {
      if (qrCodeUrl) URL.revokeObjectURL(qrCodeUrl);
    };
  }, []);

  const handleCopy = () => {
    if (!quickResult) return;
    navigator.clipboard.writeText(quickResult.shortUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Welcome */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white truncate">
          Welcome back, {user?.username}!
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-550 mt-1">
          Here is an overview of your shortened links and analytics.
        </p>
      </div>

      {/* Metrics panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total URLs"
          value={stats.totalLinks.toLocaleString()}
          icon={Link2}
          description="Cumulative links created"
          loading={loading}
          color="violet"
        />
        <StatCard
          title="Total Clicks"
          value={stats.totalClicks.toLocaleString()}
          icon={MousePointerClick}
          description="Cumulative click counts"
          loading={loading}
          color="cyan"
        />
        <StatCard
          title="Active URLs"
          value={(stats.activeLinks || 0).toLocaleString()}
          icon={Link2}
          description="Currently active links"
          loading={loading}
          color="emerald"
        />
        <StatCard
          title="Expired URLs"
          value={(stats.expiredLinks || 0).toLocaleString()}
          icon={Link2}
          description="Expired or disabled links"
          loading={loading}
          color="rose"
        />
      </div>

      {/* Quick Shortener Banner */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Quick Shorten Link
        </h3>
        <form onSubmit={handleQuickShorten} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Paste your long destination link here..."
            className="input-field flex-1 min-w-0"
            disabled={shortening}
            required
          />
          <button
            type="submit"
            disabled={shortening || !longUrl}
            className="btn-primary flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            {shortening ? 'Shortening...' : 'Shorten'}
          </button>
        </form>

        {/* Quick Shorten Result panel */}
        {quickResult && (
          <div className="mt-4 p-3 sm:p-4 rounded-xl border border-emerald-250 bg-emerald-50/50 dark:border-emerald-950/20 dark:bg-emerald-950/10 transition-all animate-fade-in text-sm text-emerald-800 dark:text-emerald-350">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
                <span className="font-semibold flex-shrink-0">Short URL:</span>
                <a
                  href={quickResult.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono underline font-medium break-all sm:truncate hover:text-emerald-600 dark:hover:text-emerald-400 min-w-0"
                >
                  {quickResult.shortUrl}
                </a>
              </div>
              <button
                onClick={handleCopy}
                className="touch-target p-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200/30 dark:border-emerald-950/20 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 active:scale-95 transition-all flex-shrink-0 self-start sm:self-auto"
                title="Copy"
                aria-label="Copy short URL"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {qrCodeUrl && (
              <div className="mt-6 pt-6 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col items-center justify-center text-center space-y-4">
                <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-violet-500 animate-pulse" />
                  Your Direct QR Code is Ready
                </h4>
                <div className="relative group bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/60 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl flex-shrink-0 w-full max-w-[224px] sm:max-w-none">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-full max-w-[200px] sm:w-56 sm:h-56 mx-auto rounded-2xl object-contain aspect-square"
                  />
                  <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center pointer-events-none">
                    <span className="bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md">Scan Me</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                  Scan this high-resolution QR code to immediately visit your shortened link. Download the image below for marketing printouts, flyers, or social graphics.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = qrCodeUrl;
                    link.download = `qrcode-${quickResult.shortCode}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="btn-primary py-2.5 px-6 text-sm inline-flex items-center gap-2 shadow-lg shadow-violet-500/20 hover:scale-[1.02] active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Download QR Code (PNG)
                </button>
              </div>
            )}
            {qrLoading && (
              <div className="mt-6 pt-6 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-full max-w-[224px] aspect-square bg-slate-100 dark:bg-slate-900/50 animate-pulse rounded-3xl border border-slate-200/20" />
                <div className="h-4 bg-slate-150 dark:bg-slate-850 animate-pulse rounded w-1/3" />
                <div className="h-3 bg-slate-150 dark:bg-slate-850 animate-pulse rounded w-1/2" />
                <div className="h-10 bg-slate-150 dark:bg-slate-850 animate-pulse rounded w-1/4" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="w-full">
        {/* Recent URLs */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent URLs
              </h3>
              <p className="text-xs text-slate-400 mt-1">Your latest shortened links</p>
            </div>
            <Link2 className="w-5 h-5 text-violet-500" />
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : recentUrls.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No links created yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentUrls.map((url) => (
                <Link
                  key={url.id}
                  to={`/urls/${url.id}`}
                  className="p-3 bg-slate-50/50 dark:bg-slate-900/25 rounded-xl border border-slate-200/20 dark:border-slate-800/40 flex items-center justify-between gap-3 text-xs hover:border-violet-200 dark:hover:border-violet-900/30 transition-colors"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900 dark:text-white truncate block">
                      {url.title || 'Untitled Link'}
                    </span>
                    <span className="font-mono text-violet-600 dark:text-violet-400 truncate block mt-0.5">
                      /{url.shortCode}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </Link>
              ))}
              <div className="pt-2 text-center">
                <Link
                  to="/urls"
                  className="text-xs font-semibold text-violet-600 dark:text-violet-450 hover:underline flex items-center justify-center gap-1.5"
                >
                  View all links
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart and Top URLs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Click Volume Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Clicks History
              </h3>
              <p className="text-xs text-slate-400 mt-1">Total redirects in the last 7 days</p>
            </div>
            <TrendingUp className="w-5 h-5 text-violet-500" />
          </div>
          <TimelineChart data={clicksData} loading={loading} />
        </div>

        {/* Top Performing Links */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Top Performing Links
              </h3>
              <p className="text-xs text-slate-400 mt-1">Based on highest redirect clicks</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : topUrls.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No link activity recorded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {topUrls.map((url) => (
                <div
                  key={url.id}
                  className="p-3 bg-slate-50/50 dark:bg-slate-900/25 rounded-xl border border-slate-200/20 dark:border-slate-800/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900 dark:text-white truncate block">
                      {url.title || 'Untitled Link'}
                    </span>
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-violet-600 dark:text-violet-400 hover:underline hover:text-violet-500 font-medium truncate block mt-0.5"
                    >
                      /{url.shortCode}
                    </a>
                  </div>
                  <span className="flex-shrink-0 font-semibold bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-md">
                    {url.clickCount.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="pt-2 text-center">
                <Link
                  to="/urls"
                  className="text-xs font-semibold text-violet-600 dark:text-violet-450 hover:underline flex items-center justify-center gap-1.5"
                >
                  Manage all links
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
