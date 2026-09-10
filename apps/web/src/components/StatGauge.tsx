import React from 'react';

interface StatGaugeProps {
  label: string;
  value: number | null | undefined;
  max?: number;
  color?: string;
}

export const StatGauge: React.FC<StatGaugeProps> = ({
  label,
  value,
  max = 10,
  color = 'from-red-500 to-orange-500',
}) => {
  const numericValue = value ?? 0;
  const percentage = Math.min(Math.max((numericValue / max) * 100, 0), 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-300">
        <span>{label}</span>
        <span className="font-mono text-sm font-bold text-white">
          {value !== null && value !== undefined ? value.toFixed(1) : 'N/A'}
        </span>
      </div>
      <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50 shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500 ease-out shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
