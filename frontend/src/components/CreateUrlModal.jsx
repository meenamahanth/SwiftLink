import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, Type, Link as LinkIcon } from 'lucide-react';

const CreateUrlModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  editData = null, // If present, modal switches to "Edit Mode"
}) => {
  const [formData, setFormData] = useState({
    longUrl: '',
    customAlias: '',
    title: '',
    expiresAt: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editData) {
      // Map editData fields into form
      setFormData({
        longUrl: editData.longUrl || '',
        customAlias: editData.customAlias || '',
        title: editData.title || '',
        expiresAt: editData.expiresAt ? editData.expiresAt.substring(0, 16) : '',
      });
    } else {
      // Reset form
      setFormData({
        longUrl: '',
        customAlias: '',
        title: '',
        expiresAt: '',
      });
    }
    setError('');
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.longUrl) {
      setError('Destination URL is required');
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.longUrl);
    } catch (_) {
      setError('Please enter a valid URL including http:// or https://');
      return;
    }

    const payload = {
      longUrl: formData.longUrl.trim(),
      title: formData.title.trim() || null,
      customAlias: editData ? null : (formData.customAlias.trim() || null), // Alias is immutable on edit
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="create-url-title">
      <div className="modal-panel relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <h3 id="create-url-title" className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2 pr-8">
            {editData ? 'Edit Short URL' : 'Shorten a Long Link'}
            {!editData && <Sparkles className="w-5 h-5 text-violet-500 animate-pulse" />}
          </h3>
          <button
            onClick={onClose}
            className="touch-target p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors absolute top-4 right-4 sm:static sm:top-auto sm:right-auto"
            disabled={loading}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-xl border border-red-150 dark:border-red-950/30">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Destination URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" />
              Destination URL
            </label>
            <input
              type="text"
              name="longUrl"
              value={formData.longUrl}
              onChange={handleChange}
              placeholder="e.g. https://www.google.com/search?q=url-shortener-app"
              className="input-field"
              required
              disabled={loading}
            />
          </div>

          {/* Title (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              Title / Label <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Google Search Campaign"
              className="input-field"
              disabled={loading}
            />
          </div>

          {/* Custom Alias & Expiration wrapper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Custom Alias (Only editable during creation) */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Custom Alias <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                  type="text"
                  name="customAlias"
                  value={formData.customAlias}
                  onChange={handleChange}
                  placeholder="e.g. my-promo"
                  className="input-field"
                  disabled={loading || !!editData}
                />
              {editData && (
                <p className="text-[10px] text-slate-400 mt-1">Alias cannot be modified</p>
              )}
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Expiry Date <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="datetime-local"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-sm py-2.5 w-full sm:w-auto min-h-[44px]"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-sm py-2.5 px-6 w-full sm:w-auto min-h-[44px]"
              disabled={loading}
            >
              {loading ? (editData ? 'Saving...' : 'Shortening...') : (editData ? 'Save Changes' : 'Shorten URL')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUrlModal;
