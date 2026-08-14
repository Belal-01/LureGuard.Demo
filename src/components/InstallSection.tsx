import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GitBranch, Sparkles, Activity } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

export const InstallSection: React.FC = () => {

  const [playedCard1, setPlayedCard1] = useState(false);
  const [playedCard2, setPlayedCard2] = useState(false);
  const [playedCard3, setPlayedCard3] = useState(false);

  const [card1Lines, setCard1Lines] = useState<string[]>([]);
  const [showCard1Comment, setShowCard1Comment] = useState(false);

  const [card2Lines, setCard2Lines] = useState<string[]>([]);
  const [card2Checks, setCard2Checks] = useState<string[]>([]);

  const [card3Input, setCard3Input] = useState('');
  const [card3Query, setCard3Query] = useState('');
  const [showCard3Ai, setShowCard3Ai] = useState(false);

  const runCard1 = async () => {
    setCard1Lines([]);
    setShowCard1Comment(false);
    const lines = [
      '$ git clone .../LureGuard.ai.git',
      '$ cd LureGuard.ai',
      '$ cp .env.example .env',
    ];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j <= line.length; j++) {
        setCard1Lines((prev) => {
          const next = [...prev];
          next[i] = line.slice(0, j);
          return next;
        });
        await new Promise((r) => setTimeout(r, 22));
      }
      await new Promise((r) => setTimeout(r, 160));
    }
    setShowCard1Comment(true);
  };

  const runCard2 = async () => {
    setCard2Lines([]);
    setCard2Checks([]);
    const lines = [
      '$ docker compose up -d',
      '$ make venv && make migrate && make doctor',
    ];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j <= line.length; j++) {
        setCard2Lines((prev) => {
          const next = [...prev];
          next[i] = line.slice(0, j);
          return next;
        });
        await new Promise((r) => setTimeout(r, 20));
      }
      await new Promise((r) => setTimeout(r, 120));
    }

    const checks = ['Docker daemon', 'Postgres', 'Wazuh', 'Core API', 'opencode MCP'];
    for (let k = 0; k < checks.length; k++) {
      await new Promise((r) => setTimeout(r, 140));
      setCard2Checks((prev) => [...prev, checks[k]]);
    }
  };

  const runCard3 = async () => {
    setCard3Input('');
    setCard3Query('');
    setShowCard3Ai(false);

    const cmd = '$ opencode';
    for (let j = 0; j <= cmd.length; j++) {
      setCard3Input(cmd.slice(0, j));
      await new Promise((r) => setTimeout(r, 25));
    }
    await new Promise((r) => setTimeout(r, 180));

    const q = 'opencode> triage alerts, last 2h';
    for (let j = 0; j <= q.length; j++) {
      setCard3Query(q.slice(0, j));
      await new Promise((r) => setTimeout(r, 18));
    }
    await new Promise((r) => setTimeout(r, 240));
    setShowCard3Ai(true);
  };

  return (
    <section id="install" className="w-full px-6 sm:px-8 py-16 md:py-24 text-left dir-ltr relative z-10 border-b border-slate-200/80 dark:border-slate-800/80 scroll-mt-20 overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionHeader
          tag="Self-hosted · Docker · AI-native"
          title={
            <>
              Deploy in <span className="text-cyan-600 dark:text-cyan-400">three</span> commands.
            </>
          }
          subtitle={
            <>
              No complex dashboards to configure. Clone the repo, let the stack boot itself, then talk to{' '}
              <code className="font-mono text-slate-800 dark:text-slate-200 bg-slate-200/80 dark:bg-[#141c2e] border border-slate-300 dark:border-[#2563eb]/40 px-1.5 py-0.5 rounded text-sm">
                opencode
              </code>{' '}
              like it's already on your team.
            </>
          }
          align="center"
        />
      </motion.div>

      {/* 3 Step Cards Grid with Staggered Motion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* STEP 1 CARD */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => {
            if (!playedCard1) {
              setPlayedCard1(true);
              runCard1();
            }
          }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6, transition: { duration: 0.25 } }}
          onMouseEnter={runCard1}
          className="group relative rounded-2xl bg-white/95 dark:bg-[#141419]/95 border border-slate-200 dark:border-[#172033] hover:border-cyan-500/60 dark:hover:border-[#06b6d4]/60 transition-all duration-300 overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-xl cursor-pointer"
        >
          <div className="flex items-center justify-between px-5 pt-4 font-mono text-xs text-slate-500 dark:text-[#7e8eb0] tracking-wider uppercase">
            <span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">01 /</span> CLONE &amp; CONFIGURE
            </span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="px-2 py-0.5 rounded border border-cyan-500/30 dark:border-[#06b6d4]/40 bg-cyan-50 dark:bg-[#164e63]/20 text-cyan-700 dark:text-[#22d3ee] font-semibold text-[11px]"
            >
              ~20s
            </motion.span>
          </div>

          {/* Terminal Box */}
          <div className="mx-4 mt-3.5 bg-slate-950 dark:bg-[#0a0d12] border border-slate-800 dark:border-[#161e31] rounded-xl h-48 overflow-hidden flex flex-col font-mono text-xs">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 dark:bg-[#0d1117] border-b border-slate-800 dark:border-[#161e31]">
              <span className="w-2 h-2 rounded-full bg-rose-900/80" />
              <span className="w-2 h-2 rounded-full bg-amber-900/80" />
              <span className="w-2 h-2 rounded-full bg-emerald-900/80" />
              <span className="text-[10px] text-slate-500 dark:text-[#64748b] ml-1.5">bash</span>
            </div>

            <div className="p-3.5 space-y-1.5 text-slate-200 dark:text-slate-200 font-mono text-[12px] leading-relaxed flex-1 overflow-hidden">
              {card1Lines.map((line, idx) => (
                <div key={idx} className="whitespace-pre">
                  {line}
                  {idx === card1Lines.length - 1 && !showCard1Comment && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1.5 h-3 bg-cyan-400 ml-0.5 align-middle"
                    />
                  )}
                </div>
              ))}
              {showCard1Comment && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-500 dark:text-[#64748b] font-mono text-[11px] pt-1"
                >
                  # optional: VT / AbuseIPDB / Telegram keys
                </motion.div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 pt-4">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-[#111827] border border-cyan-200/80 dark:border-[#1e293b] text-cyan-600 dark:text-[#22d3ee] flex items-center justify-center mb-3 shadow-xs group-hover:border-cyan-500/40 group-hover:scale-105 transition-all duration-300">
              <GitBranch className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-white mb-1.5">
              Clone &amp; configure
            </h3>
            <p className="text-slate-600 dark:text-[#7e8eb0] text-sm leading-relaxed font-sans">
              Grab the repo and drop your keys into{' '}
              <code className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#1e3a8a]/30 border border-slate-200 dark:border-[#2563eb]/40 px-1 py-0.5 rounded">
                .env
              </code>{' '}
              — VirusTotal, AbuseIPDB, and Telegram alerts are optional.
            </p>
          </div>
        </motion.div>

        {/* STEP 2 CARD */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => {
            if (!playedCard2) {
              setPlayedCard2(true);
              runCard2();
            }
          }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6, transition: { duration: 0.25 } }}
          onMouseEnter={runCard2}
          className="group relative rounded-2xl bg-white/95 dark:bg-[#141419]/95 border border-slate-200 dark:border-[#172033] hover:border-amber-500/60 dark:hover:border-[#fbbf24]/60 transition-all duration-300 overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-xl cursor-pointer"
        >
          <div className="flex items-center justify-between px-5 pt-4 font-mono text-xs text-slate-500 dark:text-[#7e8eb0] tracking-wider uppercase">
            <span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">02 /</span> VERIFY STACK
            </span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="px-2 py-0.5 rounded border border-amber-500/30 dark:border-[#4d3d14] bg-amber-50 dark:bg-[#2a220e]/80 text-amber-700 dark:text-[#fbbf24] font-semibold text-[11px]"
            >
              ~90s
            </motion.span>
          </div>

          {/* Terminal Box */}
          <div className="mx-4 mt-3.5 bg-slate-950 dark:bg-[#0a0d12] border border-slate-800 dark:border-[#161e31] rounded-xl h-48 overflow-hidden flex flex-col font-mono text-xs">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 dark:bg-[#0d1117] border-b border-slate-800 dark:border-[#161e31]">
              <span className="w-2 h-2 rounded-full bg-rose-900/80" />
              <span className="w-2 h-2 rounded-full bg-amber-900/80" />
              <span className="w-2 h-2 rounded-full bg-emerald-900/80" />
              <span className="text-[10px] text-slate-500 dark:text-[#64748b] ml-1.5">make doctor</span>
            </div>

            <div className="p-3.5 space-y-1.5 text-slate-200 dark:text-slate-200 font-mono text-[12px] leading-relaxed flex-1 overflow-hidden">
              {card2Lines.map((line, idx) => (
                <div key={idx} className="whitespace-pre">
                  {line}
                  {idx === card2Lines.length - 1 && card2Checks.length === 0 && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1.5 h-3 bg-amber-400 ml-0.5 align-middle"
                    />
                  )}
                </div>
              ))}
              {card2Checks.length > 0 && (
                <div className="space-y-0.5 pt-1">
                  {card2Checks.map((label, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span className="text-emerald-400 dark:text-[#34d399] font-bold">✓</span>
                      <span className="text-slate-400 dark:text-[#64748b]">{label}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 pt-4">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-[#181611] border border-amber-200/80 dark:border-[#2d2516] text-amber-600 dark:text-[#fbbf24] flex items-center justify-center mb-3 shadow-xs group-hover:border-amber-500/40 group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-white mb-1.5">
              Stack boots itself
            </h3>
            <p className="text-slate-600 dark:text-[#7e8eb0] text-sm leading-relaxed font-sans">
              Docker, Postgres, and Wazuh come up together.{' '} <br/>
              <code className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#2a220e]/80 border border-slate-200 dark:border-[#4d3d14] px-1 py-0.5 rounded">
                make doctor
              </code>{' '}
              confirms every service is healthy.
            </p>
          </div>
        </motion.div>

        {/* STEP 3 CARD */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => {
            if (!playedCard3) {
              setPlayedCard3(true);
              runCard3();
            }
          }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6, transition: { duration: 0.25 } }}
          onMouseEnter={runCard3}
          className="group relative rounded-2xl bg-white/95 dark:bg-[#141419]/95 border border-slate-200 dark:border-[#172033] hover:border-emerald-500/60 dark:hover:border-[#34d399]/60 transition-all duration-300 overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-xl cursor-pointer"
        >
          <div className="flex items-center justify-between px-5 pt-4 font-mono text-xs text-slate-500 dark:text-[#7e8eb0] tracking-wider uppercase">
            <span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">03 /</span> LAUNCH ANALYST
            </span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-2 py-0.5 rounded border border-emerald-500/30 dark:border-[#10b981]/40 bg-emerald-50 dark:bg-[#065f46]/20 text-emerald-700 dark:text-[#34d399] font-semibold text-[11px]"
            >
              live
            </motion.span>
          </div>

          {/* Terminal Box */}
          <div className="mx-4 mt-3.5 bg-slate-950 dark:bg-[#0a0d12] border border-slate-800 dark:border-[#161e31] rounded-xl h-48 overflow-hidden flex flex-col font-mono text-xs">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 dark:bg-[#0d1117] border-b border-slate-800 dark:border-[#161e31]">
              <span className="w-2 h-2 rounded-full bg-rose-900/80" />
              <span className="w-2 h-2 rounded-full bg-amber-900/80" />
              <span className="w-2 h-2 rounded-full bg-emerald-900/80" />
              <span className="text-[10px] text-slate-500 dark:text-[#64748b] ml-1.5">opencode</span>
            </div>

            <div className="p-3.5 space-y-2 text-slate-200 dark:text-slate-200 font-mono text-[12px] leading-relaxed flex-1 overflow-hidden">
              {card3Input && (
                <div className="whitespace-pre">
                  {card3Input}
                  {!card3Query && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1.5 h-3 bg-emerald-400 ml-0.5 align-middle"
                    />
                  )}
                </div>
              )}
              {card3Query && (
                <div className="text-blue-400 dark:text-[#60a5fa] whitespace-pre">
                  {card3Query}
                  {!showCard3Ai && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1.5 h-3 bg-blue-400 dark:bg-[#60a5fa] ml-0.5 align-middle"
                    />
                  )}
                </div>
              )}
              {showCard3Ai && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-400 dark:text-[#64748b] pt-0.5"
                >
                  <span className="text-emerald-400 dark:text-[#34d399] font-bold">[agent]</span> 3 SSH bursts contained &middot; 1 flagged for review
                </motion.div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 pt-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-[#0c1a16] border border-emerald-200/80 dark:border-[#133027] text-emerald-600 dark:text-[#34d399] flex items-center justify-center mb-3 shadow-xs group-hover:border-emerald-500/40 group-hover:scale-105 transition-all duration-300">
              <Activity className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-white mb-1.5">
              Talk to your SOC
            </h3>
            <p className="text-slate-600 dark:text-[#7e8eb0] text-sm leading-relaxed font-sans">
              Ask in plain English —{' '}
              <code className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#065f46]/20 border border-slate-200 dark:border-[#10b981]/40 px-1 py-0.5 rounded">
                opencode
              </code>{' '}
              reads your alerts, triages them, and reports back.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
