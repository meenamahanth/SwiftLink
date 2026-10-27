import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, loading = false, color = 'violet' }) => {
  const colorMap = {
    violet: 'bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400',
    cyan: 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400',
    amber: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400',
  };

  const glowMap = {
    violet: 'hover:shadow-[0_0_24px_rgba(139,92,246,0.18)] hover:border-violet-500/30',
    emerald: 'hover:shadow-[0_0_24px_rgba(52,211,153,0.18)] hover:border-emerald-500/30',
    cyan: 'hover:shadow-[0_0_24px_rgba(6,182,212,0.18)] hover:border-cyan-500/30',
    amber: 'hover:shadow-[0_0_24px_rgba(245,158,11,0.18)] hover:border-amber-500/30',
  };

  const selectedColor = colorMap[color] || colorMap.violet;
  const selectedGlow = glowMap[color] || glowMap.violet;

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-2xl p-4 sm:p-6 hover:translate-y-[-2px] transition-all duration-300 ${selectedGlow}`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
          {title}
        </span>
        <div className={`p-2 sm:p-2.5 rounded-xl flex-shrink-0 ${selectedColor}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mb-1">
        {value}
      </h3>
      {description && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {description}
        </span>
      )}
    </div>
  );
};

export default StatCard;
