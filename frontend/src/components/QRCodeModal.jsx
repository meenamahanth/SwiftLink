import React, { useState, useEffect } from 'react';
import { X, Download, QrCode } from 'lucide-react';
import api from '../services/api';
import Loader from './Loader';

const QRCodeModal = ({ isOpen, onClose, urlId, shortCode, longUrl }) => {
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && urlId) {
      setLoading(true);
      setError('');
      
      // Fetch QR Code image as a Blob so Axios includes the JWT Authorization headers
      api.get(`/api/urls/${urlId}/qrcode`, { responseType: 'blob' })
        .then((response) => {
          const blob = new Blob([response.data], { type: 'image/png' });
          const url = URL.createObjectURL(blob);
          setQrUrl(url);
        })
        .catch((err) => {
          console.error('Error fetching QR Code:', err);
          setError('Failed to load QR code. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }

    return () => {
      if (qrUrl) {
        URL.revokeObjectURL(qrUrl);
        setQrUrl('');
      }
    };
  }, [isOpen, urlId]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qrcode-${shortCode || 'link'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="qr-modal-title">
      <div className="modal-panel relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-8 transition-all flex flex-col items-center hover:shadow-[0_0_50px_rgba(139,92,246,0.15)] duration-500">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="touch-target absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close QR code dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="w-full text-center mb-4 sm:mb-6 pt-2">
          <h3 id="qr-modal-title" className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-violet-500 animate-pulse" />
            High-Resolution QR Code
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 truncate max-w-full px-2">
            {longUrl}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="w-full max-w-[280px] sm:max-w-xs aspect-square border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 flex items-center justify-center relative overflow-hidden mb-4 sm:mb-6 shadow-md shadow-slate-100/50 dark:shadow-none">
          {loading && <Loader size="md" />}
          {error && <p className="text-xs text-red-500 font-semibold p-4 text-center">{error}</p>}
          {!loading && !error && qrUrl && (
            <img
              src={qrUrl}
              alt="Short URL QR Code"
              className="w-full h-full object-contain p-6"
            />
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownload}
          disabled={loading || !qrUrl}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3 min-h-[44px] rounded-2xl shadow-lg shadow-violet-500/20"
        >
          <Download className="w-4 h-4" />
          Download High-Quality PNG
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
