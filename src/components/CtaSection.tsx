import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import GlowLight from './GlowLight';

export const CtaSection: React.FC = () => {
  return (
    <section className="w-full border-t border-slate-200 dark:border-slate-800/80 py-20 md:py-32 relative z-10 bg-slate-50/50 dark:bg-black/50 transition-colors overflow-hidden">
      {/* Ambient Central Glow Light */}
      <GlowLight
        color="#06b6d4"
        position="top-1/2 left-1/2"
        size="w-[350px] h-[350px] sm:w-[550px] sm:h-[350px]"
        blur="blur-[120px]"
        opacity="opacity-30 dark:opacity-40"
        offset="-translate-x-1/2 -translate-y-1/2"
        className="-z-10 pointer-events-none"
        zIndex={0}
      />

      <div className="max-w-5xl w-full mx-auto px-4 flex flex-col items-center justify-center text-center relative z-10">
        {/* Main CTA Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-sans tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto mb-5 leading-tight">
          Experience security that takes minutes, not weeks.
        </h2>

        {/* Subtitle */}
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-sans max-w-2xl mx-auto mb-9">
          See why security teams are switching to LureGuard.ai.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Primary Button */}
          <a
            href="#sandbox"
            className="px-6 py-3 rounded-xl font-sans text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-300 flex items-center gap-2 shadow-md hover:scale-105 group"
          >
            <span>Talk to the founders</span>
            <ArrowUpRight className="w-4 h-4 text-white dark:text-slate-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 stroke-[2.5]" />
          </a>

          {/* Secondary Button */}
          <a
            href="/docs"
            className="px-6 py-3 rounded-xl font-sans text-sm font-semibold bg-transparent border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
          >
            <span>Get the audit worksheet</span>
          </a>
        </div>
      </div>
    </section>
  );
};
