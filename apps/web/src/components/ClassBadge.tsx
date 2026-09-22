import React from 'react';

interface ClassBadgeProps {
  className?: string;
  pi?: number;
  size?: 'sm' | 'md' | 'lg';
}

const classColors: Record<string, { bg: string; text: string; border: string }> = {
  D: { bg: 'bg-[#06B6D4]', text: 'text-white font-black', border: 'border-[#0891B2]' },
  C: { bg: 'bg-[#EAB308]', text: 'text-white font-black', border: 'border-[#CA8A04]' },
  B: { bg: 'bg-[#F97316]', text: 'text-white font-black', border: 'border-[#EA580C]' },
  A: { bg: 'bg-[#EF4444]', text: 'text-white font-black', border: 'border-[#DC2626]' },
  S1: { bg: 'bg-[#A855F7]', text: 'text-white font-black', border: 'border-[#9333EA]' },
  S2: { bg: 'bg-[#2563EB]', text: 'text-white font-black', border: 'border-[#1D4ED8]' },
  R: { bg: 'bg-[#D946EF]', text: 'text-white font-black', border: 'border-[#C026D3]' },
  X: { bg: 'bg-[#22C55E]', text: 'text-white font-black', border: 'border-[#16A34A]' },
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
