import React from 'react';
import { Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { SectionHeader } from './SectionHeader';

export const WhatIsLureGuardSection: React.FC = () => {
  return (
    <section className="w-full px-6 sm:px-8 py-16 md:py-24 flex flex-col items-center justify-center text-center relative z-10 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
      {/* Centered Styled Heading with Motion */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <SectionHeader
          tag="PLATFORM ARCHITECTURE"
          title={
            <>
              What is <span className="text-cyan-600 dark:text-cyan-400">lureguard.ai</span>?
            </>
          }
          subtitle="Autonomous AI honeypot gateway designed to lure adversaries, isolate attacks, and analyze threats in real time."
          align="center"
        />
      </motion.div>

      {/* Terminal / Code Window Container */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl rounded-2xl bg-white/95 dark:bg-[#141419]/95 border border-slate-200 dark:border-[#172033] shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-xl text-left transition-all hover:border-cyan-500/30 dark:hover:border-cyan-500/30"
      >
        {/* macOS / Linux Style Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-100/90 dark:bg-[#0d1117] border-b border-slate-200 dark:border-[#161e31] select-none transition-colors">
          <div className="flex items-center gap-2">
            <motion.span
              whileHover={{ scale: 1.2 }}
              className="w-3 h-3 rounded-full bg-rose-500/80 inline-block cursor-pointer"
            />
            <motion.span
              whileHover={{ scale: 1.2 }}
              className="w-3 h-3 rounded-full bg-amber-500/80 inline-block cursor-pointer"
            />
            <motion.span
              whileHover={{ scale: 1.2 }}
              className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-[#7e8eb0]">
            <Terminal className="w-3.5 h-3.5 text-cyan-600 dark:text-[#06b6d4]" />
            <span>&gt;_ /lureguard --describe</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-1.5 h-3.5 bg-cyan-600 dark:bg-cyan-400 ml-0.5"
            />
          </div>

          <div className="w-12 hidden sm:block" />
        </div>

        {/* Terminal Text Content */}
        <div className="p-6 sm:p-8 md:p-10 font-sans text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed space-y-6 transition-colors">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <strong className="text-slate-900 dark:text-white font-mono font-bold">LureGuard.ai</strong> is an open-source, AI-powered cyber deception and threat intelligence platform designed to preemptively outpace attackers before they breach production infrastructure. It deploys isolated honeypot traps—spanning SSH, HTTP APIs, and DB containers—that lure adversaries into zero-trust containment environments.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            Utilizing a real-time sliding-window ML classifier, LureGuard evaluates attack metrics in{' '}
            <span className="text-cyan-600 dark:text-[#06b6d4] font-mono font-semibold">sub-150ms</span>, calculates dynamic threat scores, and enforces pre-connection{' '}
            <span className="text-cyan-600 dark:text-[#06b6d4] font-mono font-semibold">iptables DNAT redirection</span> to instantly isolate malicious actors. High-priority incident alerts are autonomously dispatched via Telegram SOC bots alongside automated BYOLLM executive summary reports.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            Built on proven Wazuh architecture:{' '}
            <span className="text-cyan-600 dark:text-[#06b6d4] font-mono font-bold">zero production latency</span>,{' '}
            <span className="text-cyan-600 dark:text-[#06b6d4] font-mono font-bold">zero code friction</span>,{' '}
            <span className="text-cyan-600 dark:text-[#06b6d4] font-mono font-bold">100% open platform</span>. MIT-licensed and free forever for security engineering teams worldwide.
          </motion.p>

          {/* Terminal Footer Comment Line */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="pt-4 border-t border-slate-200 dark:border-[#161e31] font-mono text-xs sm:text-sm text-slate-500 dark:text-[#64748b]"
          >
            <span>// Open Source · MIT License · Autonomous Cyber Deception</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
