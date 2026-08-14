import React from 'react';

interface SectionHeaderProps {
  tag?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  tag,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`mb-10 sm:mb-12 ${
        isCenter ? 'text-center' : 'text-left'
      } ${className}`}
    >
      {tag && (
        <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
          <span className="text-slate-400 dark:text-slate-500">—</span>
          <span>{tag}</span>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
        {title}
      </h2>

      {subtitle && (
        <p
          className={`text-slate-600 dark:text-[#808b9c] mt-3.5 text-sm sm:text-base font-sans leading-relaxed ${
            isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
