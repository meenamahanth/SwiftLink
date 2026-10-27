import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, QrCode, BarChart3, Edit, Trash2, Calendar, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const UrlTable = ({
  urls,
  loading = false,
  onEdit,
  onQrCode,
  onDelete,
  onToggleStatus,
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse">
        <table className="w-full min-w-[800px] border-collapse bg-white dark:bg-slate-900">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-left">
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-100 dark:border-slate-800">
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" role="region" aria-label="Short URLs table">
      <table className="w-full min-w-[720px] md:min-w-[800px] border-collapse text-left text-sm text-slate-700 dark:text-slate-350">
        <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <tr>
            <th className="p-4 pl-6">Link Details</th>
            <th className="p-4">Shortened URL</th>
            <th className="p-4">Clicks</th>
            <th className="p-4">Expires</th>
            <th className="p-4">Status</th>
            <th className="p-4 pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {urls.map((url) => {
            const expired = isExpired(url.expiresAt);
            const active = url.isEnabled && !expired;

            return (
              <tr
                key={url.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
              >
                {/* Title & Long URL */}
                <td className="p-4 pl-6 max-w-[280px]">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white truncate">
                      {url.title || 'Untitled Link'}
                    </span>
                    <a
                      href={url.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 dark:text-slate-500 hover:text-violet-500 hover:underline flex items-center gap-1 mt-1 truncate"
                    >
                      {url.longUrl}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                </td>

                {/* Short Code & Copy Button */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-violet-600 dark:text-violet-400 hover:underline font-mono"
                    >
                      /{url.shortCode}
                    </a>
                    <button
                      onClick={() => handleCopy(url.id, url.shortUrl)}
                      className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Copy Link"
                    >
                      {copiedId === url.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>

                {/* Clicks */}
                <td className="p-4">
                  <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg text-xs">
                    {url.clickCount.toLocaleString()}
                  </span>
                </td>

                {/* Expiry Date */}
                <td className="p-4 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(url.expiresAt)}
                  </div>
                </td>

                {/* Status Toggle Switch */}
                <td className="p-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => onToggleStatus(url.id, !url.isEnabled)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        url.isEnabled
                          ? 'bg-violet-600'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                      role="switch"
                      aria-checked={url.isEnabled}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          url.isEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="ml-2 text-xs">
                      {active ? (
                        <span className="text-emerald-600 dark:text-emerald-450 font-medium">Active</span>
                      ) : expired ? (
                        <span className="text-amber-500 dark:text-amber-450 font-medium">Expired</span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Disabled</span>
                      )}
                    </span>
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="p-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/urls/${url.id}`}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                      title="View Analytics"
                    >
                      <BarChart3 className="w-4.5 h-4.5" />
                    </Link>
                    <button
                      onClick={() => onQrCode(url)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                      title="QR Code"
                    >
                      <QrCode className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => onEdit(url)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                      title="Edit Link"
                    >
                      <Edit className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => onDelete(url)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-650 dark:hover:text-red-400 transition-colors"
                      title="Delete Link"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UrlTable;
