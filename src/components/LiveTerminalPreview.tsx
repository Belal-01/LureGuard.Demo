import React, { useEffect, useRef, useState } from 'react';
import { Terminal, ShieldAlert, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

interface LogItem {
  id: string;
  timestamp: string;
  type: 'info' | 'warn' | 'triage' | 'alert';
  text: string;
}

const INITIAL_LOGS: LogItem[] = [
  {
    id: '1',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    type: 'info',
    text: '[+] HONEYPOT_LISTEN: Port 2222 (Cowrie) active...',
  },
  {
    id: '2',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    type: 'warn',
    text: '[!] INBOUND_CONN: IP 185.220.101.5 (TOR Exit Node)',
  },
  {
    id: '3',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    type: 'triage',
    text: '[*] AI_TRIAGE: Analyzing SSH brute-force signature...',
  },
  {
    id: '4',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    type: 'alert',
    text: '[✓] ACTION: Threat Score 94/100 -> Telegram Alert Dispatched!',
  },
];

const STREAMING_POOL = [
  { type: 'info' as const, text: '[+] HONEYPOT_LISTEN: Port 8080 (HTTP Trap) listening...' },
  { type: 'warn' as const, text: '[!] INBOUND_CONN: IP 45.33.32.156 (Scanner Botnet)' },
  { type: 'triage' as const, text: '[*] AI_TRIAGE: SQL Injection payload detected in URI' },
  { type: 'alert' as const, text: '[✓] ACTION: Threat Score 88/100 -> IP Quarantined' },
  { type: 'info' as const, text: '[+] HONEYPOT_LISTEN: Port 21 (FTP Trap) ready...' },
  { type: 'warn' as const, text: '[!] INBOUND_CONN: IP 198.51.100.42 (Brute Force)' },
  { type: 'triage' as const, text: '[*] AI_TRIAGE: Root credential dictionary attack' },
  { type: 'alert' as const, text: '[✓] ACTION: Threat Score 96/100 -> Alert Dispatched!' },
];

export const LiveTerminalPreview: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS);
  const containerRef = useRef<HTMLDivElement>(null);
  const poolIndexRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const poolItem = STREAMING_POOL[poolIndexRef.current % STREAMING_POOL.length];
      poolIndexRef.current++;

      const newLog: LogItem = {
        id: String(Date.now()),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: poolItem.type,
        text: poolItem.text,
      };

      setLogs((prev) => {
        const next = [...prev, newLog];
        if (next.length > 12) next.shift(); // keep last 12 logs
        return next;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className=" h-full backdrop-blur-sm  border border-slate-800/90 overflow-hidden  glow-border-cyan w-full text-left dir-ltr">
      {/* Top Window Header Bar */}
      <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className=" p-4 flex items-center gap-2">
          {/* Traffic light control dots */}
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          <span className="ml-2 font-mono text-xs text-slate-400 font-semibold tracking-wide flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            lureguard-node-01: ~/logs/triage.log
          </span>
        </div>

        {/* Live Indicator Badge */}
        <div className=" p-4 flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[10px]">
          <Radio className="w-3 h-3 animate-pulse text-rose-500" />
          <span>LIVE STREAM</span>
        </div>
      </div>

      {/* Terminal Log Stream Area */}
      <div
        ref={containerRef}
        className="p-4 font-mono text-xs sm:text-sm bg-cyber-panel/95 h-[480px] overflow-y-auto space-y-2.5 scanline-bg relative select-text"
      >
        {logs.map((log) => {
          let textClass = 'text-slate-300';
          let icon = null;

          if (log.type === 'info') {
            textClass = 'text-cyan-400';
          } else if (log.type === 'warn') {
            textClass = 'text-amber-400';
            icon = <AlertTriangle className="w-3.5 h-3.5 inline mr-1 text-amber-400" />;
          } else if (log.type === 'triage') {
            textClass = 'text-emerald-400';
          } else if (log.type === 'alert') {
            textClass = 'text-rose-400 font-semibold glow-text-rose';
            icon = <ShieldAlert className="w-3.5 h-3.5 inline mr-1 text-rose-400" />;
          }

          return (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed animate-fadeIn">
              <div className={`${textClass} break-all flex-1`}>
                {icon}
                {log.text}
              </div>
            </div>
          );
        })}

        {/* Bouncing cursor prompt at bottom */}
        <div className="flex items-center gap-2 pt-2 text-emerald-400 font-mono text-xs">
          <span>root@lureguard-node-01:~#</span>
          <span className="w-2 h-4 bg-emerald-400 animate-blink inline-block"></span>
        </div>
      </div>
    </div>
  );
};
