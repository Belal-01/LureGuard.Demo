import React from 'react';
import { Terminal } from 'lucide-react';

export const WhatIsLureGuardSection: React.FC = () => {
  return (
    <section className="max-w-5xl w-full mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center relative z-10">
      {/* Centered Styled Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono text-slate-900 dark:text-white font-medium tracking-tight mb-10 transition-colors">
        What is <span className="font-serif italic text-cyan-600 dark:text-[#06b6d4]">lureguard.ai</span>?
      </h2>

      {/* Terminal / Code Window Container */}
      <div className="w-full max-w-4xl rounded-2xl bg-white/95 dark:bg-[#141419]/95 border border-slate-200 dark:border-[#172033] shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-xl text-left transition-colors">
        {/* macOS / Linux Style Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-100/90 dark:bg-[#0d1117] border-b border-slate-200 dark:border-[#161e31] select-none transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-[#7e8eb0]">
            <Terminal className="w-3.5 h-3.5 text-cyan-600 dark:text-[#06b6d4]" />
            <span>&gt;_ /lureguard --describe</span>
          </div>

          <div className="w-12 hidden sm:block" />
        </div>

        {/* Terminal Text Content */}
        <div className="p-6 sm:p-8 md:p-10 font-sans text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed space-y-6 transition-colors">
          <p>
            <strong className="text-slate-900 dark:text-white font-mono font-bold">LureGuard.ai</strong> is an open-source, AI-powered cyber deception and threat intelligence platform designed to preemptively outpace attackers before they breach production infrastructure. It deploys isolated honeypot traps—spanning SSH, HTTP APIs, and DB containers—that lure adversaries into zero-trust containment environments.
          </p>

          <p>
            Utilizing a real-time sliding-window ML classifier, LureGuard evaluates attack metrics in{' '}
            <span className="text-cyan-600 dark:text-[#06b6d4] font-mono font-semibold">sub-150ms</span>, calculates dynamic threat scores, and enforces pre-connection{' '}
            <span className="text-cyan-600 dark:text-[#06b6d4] font-mono font-semibold">iptables DNAT redirection</span> to instantly isolate malicious actors. High-priority incident alerts are autonomously dispatched via Telegram SOC bots alongside automated BYOLLM executive summary reports.
          </p>

          <p>
            Built on proven Wazuh architecture:{' '}
            <span className="text-cyan-600 dark:text-[#06b6d4] font-mono font-bold">zero production latency</span>,{' '}
            <span className="text-cyan-600 dark:text-[#06b6d4] font-mono font-bold">zero code friction</span>,{' '}
            <span className="text-cyan-600 dark:text-[#06b6d4] font-mono font-bold">100% open platform</span>. MIT-licensed and free forever for security engineering teams worldwide.
          </p>

          {/* Terminal Footer Comment Line */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#161e31] font-mono text-xs sm:text-sm text-slate-500 dark:text-[#64748b]">
            <span>// Open Source · MIT License · Autonomous Cyber Deception</span>
          </div>
        </div>
      </div>
    </section>
  );
};
