import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, QrCode, BarChart3, Edit, Trash2, Calendar, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const UrlCard = ({
  url,
  loading = false,
  onEdit,
  onQrCode,
  onDelete,
  onToggleStatus,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url.shortUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isExpired = () => {
    if (!url.expiresAt) return false;
    return new Date(url.expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 animate-pulse space-y-4">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
        </div>
      </div>
    );
  }

  const expired = isExpired();
  const active = url.isEnabled && !expired;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 hover-glow transition-all duration-200 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between gap-4 min-w-0">
      
      {/* Title & Dest URL */}
      <div className="space-y-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-semibold text-slate-900 dark:text-white truncate min-w-0 flex-1">
            {url.title || 'Untitled Link'}
          </h4>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            active
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
              : expired
              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {active ? 'Active' : expired ? 'Expired' : 'Disabled'}
          </span>
        </div>
        <a
          href={url.longUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 dark:text-slate-500 hover:text-violet-500 flex items-center gap-1 hover:underline truncate"
        >
          {url.longUrl}
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      </div>

      {/* Short Link Block */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-900">
        <a
          href={url.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline truncate mr-2"
        >
          {url.shortUrl.replace(/^https?:\/\//, '')}
        </a>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shadow-xs active:scale-95 transition-all"
          title="Copy Link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expiry & Click counts */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(url.expiresAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Clicks:</span>
          <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            {url.clickCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Toggle switch and Operations */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-3">
        {/* Toggle switch */}
        <div className="flex items-center">
          <button
            onClick={() => onToggleStatus(url.id, !url.isEnabled)}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
              url.isEnabled ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-800'
            }`}
            role="switch"
            aria-checked={url.isEnabled}
            aria-label={url.isEnabled ? 'Disable link' : 'Enable link'}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                url.isEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="ml-2 text-[10px] text-slate-500 dark:text-slate-400">
            {url.isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        {/* Actions panel */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link
            to={`/urls/${url.id}`}
            className="touch-target p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors border border-slate-200/30 dark:border-slate-800/50"
            title="Analytics"
            aria-label="View analytics"
          >
            <BarChart3 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onQrCode(url)}
            className="touch-target p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors border border-slate-200/30 dark:border-slate-800/50"
            title="QR Code"
            aria-label="View QR code"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(url)}
            className="touch-target p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors border border-slate-200/30 dark:border-slate-800/50"
            title="Edit"
            aria-label="Edit link"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(url)}
            className="touch-target p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 text-red-600 transition-colors border border-red-200/20 dark:border-red-900/10"
            title="Delete"
            aria-label="Delete link"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default UrlCard;
