import React from 'react';

interface ClassBadgeProps {
  className?: string;
  pi?: number;
  size?: 'sm' | 'md' | 'lg';
}

const classColors: Record<string, { bg: string; text: string; border: string }> = {
  D: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-500' },
  C: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-500' },
  B: { bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-400' },
  A: { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-500' },
  S1: { bg: 'bg-rose-600', text: 'text-white', border: 'border-rose-500' },
  S2: { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-500' },
  R: { bg: 'bg-cyan-600', text: 'text-white', border: 'border-cyan-400' },
  X: { bg: 'bg-slate-900', text: 'text-amber-400', border: 'border-amber-400' },
};

export const ClassBadge: React.FC<ClassBadgeProps> = ({ className = 'A', pi, size = 'md' }) => {
  const normalizedClass = className.toUpperCase();
  const style = classColors[normalizedClass] || classColors['A'];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1',
    md: 'text-sm px-2.5 py-1 space-x-1.5',
    lg: 'text-base px-3.5 py-1.5 space-x-2',
  }[size];

  return (
    <div
      className={`inline-flex items-center font-bold font-display rounded-md shadow-md border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}
    >
      <span className="uppercase tracking-wider">{normalizedClass}</span>
      {pi !== undefined && (
        <span className="opacity-90 border-l border-white/20 pl-1.5 font-mono font-extrabold">{pi}</span>
      )}
    </div>
  );
};
