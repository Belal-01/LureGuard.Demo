import React from 'react';
import { motion } from 'motion/react';

export const AnimatedHeroContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Hero Brand Logo Image with Motion Entrance Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center w-28 h-16 sm:w-60 sm:h-40 md:w-[600px] md:h-[200px]"
      >
        <img
          src="/images/logo.png"
          alt="LureGuard Logo"
          className="w-28 h-16 sm:w-60 sm:h-40 md:w-[600px] md:h-[200px] object-contain  hover:scale-105 transition-all duration-300"
        />
      </motion.div>

      {/* Huge Middle Hero Title */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="text-4xl sm:text-5xl md:text-6xl font-black font-mono text-slate-900 dark:text-white leading-[1.1] tracking-tight max-w-6xl mx-auto mb-6 transition-colors"
      >
        The Preemptive Cyber MDR Leader That{' '}
        <span className="text-cyan-400  ">
          Outpaces Attackers
        </span>
      </motion.h1>

      {/* High Readability Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-sans max-w-4xl mx-auto mb-10 font-normal transition-colors"
      >
        Open platform. AI-powered. Human-led. Safeguard your infrastructure by luring adversaries into isolated traps while automated ML models triage threats in real time.
      </motion.p>

      {/* Action Buttons (Get Started & Read Docs) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.42, ease: 'easeOut' }}
        className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
      >
        {/* 1. Get Started Button */}
        <motion.a
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          href="#install"
          className="px-8 py-3  font-mono text-sm sm:text-base font-bold bg-cyan-600 dark:bg-cyan-400 hover:bg-cyan-500 dark:hover:bg-cyan-300 text-white dark:text-slate-950 transition-colors duration-300 flex items-center gap-2.5 group "
        >
          <span>GET STARTED</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 transition-transform group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.a>

        {/* 2. Read Docs Button */}
        <motion.a
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          href="/guides/01-overview"
          className="px-8 py-3  font-mono text-sm sm:text-base font-semibold bg-white dark:bg-slate-900/90 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 hover:border-cyan-500/50 transition-colors duration-300 flex items-center gap-2.5 shadow-sm"
        >
          <span>READ DOCS</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </motion.a>
      </motion.div>
    </div>
  );
};

export default AnimatedHeroContent;
