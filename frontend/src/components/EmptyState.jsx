import React from 'react';
import { Link2Off, Plus } from 'lucide-react';

const EmptyState = ({
  title = "No short URLs found",
  description = "Get started by creating your first shortened URL link.",
  actionText = "Create Link",
  onAction,
  icon: Icon = Link2Off,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/20 dark:bg-slate-900/10 backdrop-blur-sm">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary flex items-center gap-2 text-sm min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
