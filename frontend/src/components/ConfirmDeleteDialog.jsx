import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Short URL",
  message = "Are you sure you want to delete this short URL? This action is permanent and all associated analytics data will be lost forever.",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-sm" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <div className="modal-panel relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="touch-target absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          disabled={loading}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex gap-4 items-start pr-8">
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="delete-dialog-title" className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-secondary text-sm py-2.5 w-full sm:w-auto min-h-[44px]"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl text-sm transition-colors active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px]"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteDialog;
