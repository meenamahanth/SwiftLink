import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

const COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#f59e0b', '#ec4899', '#10b981'];

export const TimelineChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="chart-container-lg w-full min-w-0 flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 animate-pulse rounded-2xl">
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-container-lg w-full min-w-0 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs sm:text-sm px-4 text-center">
        No click data available for the selected timeframe.
      </div>
    );
  }

  // Format date strings for chart X axis
  const formattedData = data.map((item) => {
    const d = new Date(item.date);
    return {
      ...item,
      formattedDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    };
  });

  return (
    <div className="chart-container-lg w-full min-w-0" role="img" aria-label="Click timeline chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
          <XAxis
            dataKey="formattedDate"
            tickLine={false}
            axisLine={false}
            stroke="#94a3b8"
            fontSize={11}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="#94a3b8"
            fontSize={11}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
            labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorClicks)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DistributionBarChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="chart-container-sm w-full min-w-0 flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 animate-pulse rounded-2xl">
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-container-sm w-full min-w-0 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs sm:text-sm px-4 text-center">
        No breakdown data available.
      </div>
    );
  }

  return (
    <div className="chart-container-sm w-full min-w-0" role="img" aria-label="Distribution bar chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.slice(0, 5)} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={11} />
          <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={11} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
            }}
          />
          <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DistributionPieChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="chart-container-sm w-full min-w-0 flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 animate-pulse rounded-2xl">
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-container-sm w-full min-w-0 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs sm:text-sm px-4 text-center">
        No breakdown data available.
      </div>
    );
  }

  return (
    <div className="chart-container-sm w-full min-w-0 flex items-center justify-center" role="img" aria-label="Distribution pie chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius="40%"
            outerRadius="65%"
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconSize={10}
            iconType="circle"
            wrapperStyle={{ fontSize: '11px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
