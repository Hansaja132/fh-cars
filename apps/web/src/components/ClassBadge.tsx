import React from 'react';

interface ClassBadgeProps {
  className?: string;
  pi?: number;
  size?: 'sm' | 'md' | 'lg';
}

const classColors: Record<string, { bg: string; text: string; border: string }> = {
  D: { bg: 'bg-[#94A3B8]', text: 'text-slate-950 font-black', border: 'border-[#64748B]' },
  C: { bg: 'bg-[#22C55E]', text: 'text-slate-950 font-black', border: 'border-[#16A34A]' },
  B: { bg: 'bg-[#3B82F6]', text: 'text-white font-bold', border: 'border-[#2563EB]' },
  A: { bg: 'bg-[#8B5CF6]', text: 'text-white font-bold', border: 'border-[#7C3AED]' },
  S1: { bg: 'bg-[#F97316]', text: 'text-white font-bold', border: 'border-[#EA580C]' },
  S2: { bg: 'bg-[#EF4444]', text: 'text-white font-bold', border: 'border-[#DC2626]' },
  R: { bg: 'bg-[#00B8D9]', text: 'text-slate-950 font-black', border: 'border-[#0097B2]' },
  X: { bg: 'bg-[#EAB308]', text: 'text-slate-950 font-black', border: 'border-[#CA8A04]' },
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
      className={`inline-flex items-center font-display rounded-md shadow-md border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}
    >
      <span className="uppercase tracking-wider font-extrabold">{normalizedClass}</span>
      {pi !== undefined && (
        <span className="opacity-90 border-l border-current/20 pl-1.5 font-mono font-black">{pi}</span>
      )}
    </div>
  );
};
