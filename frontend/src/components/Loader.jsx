import React from 'react';

const Loader = ({ fullPage = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-slate-200 border-t-violet-600`}
        role="status"
        aria-label="loading"
      />
      {fullPage && (
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Loading SwiftLink...
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};

export default Loader;
