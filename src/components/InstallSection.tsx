import React, { useEffect, useRef, useState } from 'react';

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

  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === card1Ref.current && !playedCard1) {
              setPlayedCard1(true);
              runCard1();
            } else if (entry.target === card2Ref.current && !playedCard2) {
              setPlayedCard2(true);
              runCard2();
            } else if (entry.target === card3Ref.current && !playedCard3) {
              setPlayedCard3(true);
              runCard3();
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (card1Ref.current) observer.observe(card1Ref.current);
    if (card2Ref.current) observer.observe(card2Ref.current);
    if (card3Ref.current) observer.observe(card3Ref.current);

    return () => observer.disconnect();
  }, [playedCard1, playedCard2, playedCard3]);

  return (
    <section className="max-w-7xl w-full mx-auto px-4 py-16 md:py-24 text-left dir-ltr relative z-10">
      {/* Top Eyebrow */}
      <div className="flex items-center justify-center gap-2.5 font-mono text-xs text-cyan-600 dark:text-[#06b6d4] uppercase tracking-widest mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 dark:bg-[#06b6d4]" />
        </span>
        <span>Self-hosted &middot; Docker &middot; AI-native</span>
      </div>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-center text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
        Deploy in <span className="text-cyan-600 dark:text-[#06b6d4]">three</span> commands.
      </h2>

      {/* Subtitle */}
      <p className="text-center text-slate-600 dark:text-[#7e8eb0] text-base sm:text-lg font-sans max-w-2xl mx-auto mb-14 leading-relaxed">
        No dashboards to configure. Clone the repo, let the stack boot itself, then talk to{' '}
        <code className="font-mono text-slate-800 dark:text-slate-200 bg-slate-200/80 dark:bg-[#141c2e] border border-slate-300 dark:border-[#2563eb]/40 px-1.5 py-0.5 rounded text-sm">
          opencode
        </code>{' '}
        like it's already on your team.
      </p>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* STEP 1 CARD (Blue / Cyan Theme matching ThreatIntelligenceCard) */}
        <div
          ref={card1Ref}
          onMouseEnter={runCard1}
          className="group relative rounded-2xl bg-white/95 dark:bg-[#141419]/95 border border-slate-200 dark:border-[#172033] hover:border-cyan-500/60 dark:hover:border-[#06b6d4]/60 transition-all duration-300 overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-xl hover:-translate-y-1"
        >
          {/* <span className="absolute top-4 right-4 font-mono text-[10px] text-slate-400 dark:text-[#4b5875] tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            HOVER TO REPLAY
          </span> */}

          <div className="flex items-center justify-between px-5 pt-4 font-mono text-xs text-slate-500 dark:text-[#7e8eb0] tracking-wider uppercase">
            <span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">01 /</span> CLONE &amp; CONFIGURE
            </span>
            <span className="px-2 py-0.5 rounded border border-cyan-500/30 dark:border-[#06b6d4]/40 bg-cyan-50 dark:bg-[#164e63]/20 text-cyan-700 dark:text-[#22d3ee] font-semibold text-[11px]">
              ~20s
            </span>
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
                    <span className="inline-block w-1.5 h-3 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
                  )}
                </div>
              ))}
              {showCard1Comment && (
                <div className="text-slate-500 dark:text-[#64748b] font-mono text-[11px] pt-1">
                  # optional: VT / AbuseIPDB / Telegram keys
                </div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 pt-4">
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
        </div>

        {/* STEP 2 CARD (Amber Theme matching ThreatIntelligenceCard) */}
        <div
          ref={card2Ref}
          onMouseEnter={runCard2}
          className="group relative rounded-2xl bg-white/95 dark:bg-[#141419]/95 border border-slate-200 dark:border-[#172033] hover:border-amber-500/60 dark:hover:border-[#fbbf24]/60 transition-all duration-300 overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-xl hover:-translate-y-1"
        >
          {/* <span className="absolute top-4 right-4 font-mono text-[10px] text-slate-400 dark:text-[#4b5875] tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            HOVER TO REPLAY
          </span> */}

          <div className="flex items-center justify-between px-5 pt-4 font-mono text-xs text-slate-500 dark:text-[#7e8eb0] tracking-wider uppercase">
            <span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">02 /</span> VERIFY STACK
            </span>
            <span className="px-2 py-0.5 rounded border border-amber-500/30 dark:border-[#4d3d14] bg-amber-50 dark:bg-[#2a220e]/80 text-amber-700 dark:text-[#fbbf24] font-semibold text-[11px]">
              ~90s
            </span>
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
                    <span className="inline-block w-1.5 h-3 bg-amber-400 ml-0.5 animate-pulse align-middle" />
                  )}
                </div>
              ))}
              {card2Checks.length > 0 && (
                <div className="space-y-0.5 pt-1">
                  {card2Checks.map((label, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs animate-fadeIn">
                      <span className="text-emerald-400 dark:text-[#34d399] font-bold">✓</span>
                      <span className="text-slate-400 dark:text-[#64748b]">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 pt-4">
            <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-white mb-1.5">
              Stack boots itself
            </h3>
            <p className="text-slate-600 dark:text-[#7e8eb0] text-sm leading-relaxed font-sans">
              Docker, Postgres, and Wazuh come up together.{' '}
              <code className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#2a220e]/80 border border-slate-200 dark:border-[#4d3d14] px-1 py-0.5 rounded">
                make doctor
              </code>{' '}
              confirms every service is healthy.
            </p>
          </div>
        </div>

        {/* STEP 3 CARD (Emerald Theme matching ThreatIntelligenceCard) */}
        <div
          ref={card3Ref}
          onMouseEnter={runCard3}
          className="group relative rounded-2xl bg-white/95 dark:bg-[#141419]/95 border border-slate-200 dark:border-[#172033] hover:border-emerald-500/60 dark:hover:border-[#34d399]/60 transition-all duration-300 overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-xl hover:-translate-y-1"
        >
          {/* <span className="absolute top-4 right-4 font-mono text-[10px] text-slate-400 dark:text-[#4b5875] tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            HOVER TO REPLAY
          </span> */}

          <div className="flex items-center justify-between px-5 pt-4 font-mono text-xs text-slate-500 dark:text-[#7e8eb0] tracking-wider uppercase">
            <span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">03 /</span> LAUNCH ANALYST
            </span>
            <span className="px-2 py-0.5 rounded border border-emerald-500/30 dark:border-[#10b981]/40 bg-emerald-50 dark:bg-[#065f46]/20 text-emerald-700 dark:text-[#34d399] font-semibold text-[11px]">
              live
            </span>
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
                    <span className="inline-block w-1.5 h-3 bg-emerald-400 ml-0.5 animate-pulse align-middle" />
                  )}
                </div>
              )}
              {card3Query && (
                <div className="text-blue-400 dark:text-[#60a5fa] whitespace-pre">
                  {card3Query}
                  {!showCard3Ai && (
                    <span className="inline-block w-1.5 h-3 bg-blue-400 dark:bg-[#60a5fa] ml-0.5 animate-pulse align-middle" />
                  )}
                </div>
              )}
              {showCard3Ai && (
                <div className="text-slate-400 dark:text-[#64748b] pt-0.5 animate-fadeIn">
                  <span className="text-emerald-400 dark:text-[#34d399] font-bold">[agent]</span> 3 SSH bursts contained &middot; 1 flagged for review
                </div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 pt-4">
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
        </div>
      </div>
    </section>
  );
};
