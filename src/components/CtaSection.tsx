import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import GlowLight from './GlowLight';
import { SectionHeader } from './SectionHeader';

export const CtaSection: React.FC = () => {
  return (
    <section className="w-full py-20 md:py-28 relative z-10 bg-white dark:bg-[#0a0a0d] transition-colors overflow-hidden border-t border-slate-200/80 dark:border-slate-800/80">
      {/* Ambient Central Glow Light with Subtle Pulse */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
      >
        <GlowLight
          color="#06b6d4"
          position="top-1/2 left-1/2"
          size="w-[550px] h-[150px] sm:w-[850px] sm:h-[150px]"
          blur="blur-[60px]"
          opacity="opacity-50 dark:opacity-50"
          offset="-translate-x-1/2 -translate-y-1/2"
          className="-z-10 pointer-events-none"
          zIndex={0}
        />
      </motion.div>

      <div className="max-w-5xl w-full mx-auto px-4 flex flex-col items-center justify-center text-center relative z-10">
        {/* Section Header with Motion Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <SectionHeader
            tag="GET STARTED TODAY"
            title="Experience security that takes minutes, not weeks."
            subtitle="See why security teams are switching to LureGuard.ai."
            align="center"
            className="mb-8 sm:mb-8"
          />
        </motion.div>

        {/* Action Buttons with Stagger & Interactive Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* Primary Button */}
          <motion.a
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="#sandbox"
            className="px-7 py-3.5  font-sans text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors duration-300 flex items-center gap-2  group"
          >
            <span>Talk to the founders</span>
            <ArrowUpRight className="w-4 h-4 text-white dark:text-slate-950 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 stroke-[2.5]" />
          </motion.a>

          {/* Secondary Button */}
          <motion.a
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="/docs"
            className="px-7 py-3.5  font-sans text-sm font-semibold bg-white/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 "
          >
            <span>Get the audit worksheet</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
