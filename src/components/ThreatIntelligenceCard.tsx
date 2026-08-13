import React, { useEffect, useState } from 'react';
import {
  Shield,
  AlertCircle,
  CheckCircle2,
  Server,
  Database,
  Radio,
  Zap,
  Lock,
  FileCheck,
} from 'lucide-react';
import GlowLight from './GlowLight';

export interface ThreatIntelligenceCardProps {
  activeTab?: number;
  cardHeader?: string;
  cardBadge?: string;
  glowColor?: string;
  className?: string;
}

export const ThreatIntelligenceCard: React.FC<ThreatIntelligenceCardProps> = ({
  activeTab = 0,
  cardHeader = 'PREPARATION PHASE',
  cardBadge = 'HONEYPOTS ARMED',
  glowColor = '#06b6d4',
  className = '',
}) => {
  // Live jitter for the threat score, to simulate real-time telemetry
  const [liveScore, setLiveScore] = useState(94);
  const [elapsed, setElapsed] = useState(0);

  // Progressive reveal: on tabs 1 & 2, rows arrive one by one like a live event feed
  // instead of all rendering at once.
  const [visibleRows, setVisibleRows] = useState(4);

  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setLiveScore((prev) => {
        const jitter = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
        const next = prev + jitter;
        return Math.min(99, Math.max(90, next));
      });
    }, 1800);

    const clockInterval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(scoreInterval);
      clearInterval(clockInterval);
    };
  }, []);

  useEffect(() => {
    // Tab 0 (traps) is a static status board -> show everything right away
    if (activeTab === 0) {
      setVisibleRows(4);
      return;
    }

    // Tabs 1 & 2 (detections / remediation) -> reveal rows one at a time,
    // with a bit of randomness so it feels like real events landing, not a timer
    setVisibleRows(1);
    let count = 1;
    const delays = [1600, 2400, 1900]; // ms between each new row
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      if (count >= 4) return;
      timeoutId = setTimeout(() => {
        count += 1;
        setVisibleRows(count);
        scheduleNext();
      }, delays[count - 1]);
    };
    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, [activeTab]);

  return (
    <div
      className={`relative rounded-2xl border border-slate-200 dark:border-[#172033] bg-white/95 dark:bg-[#141419]/95 p-5 sm:p-6 shadow-xl dark:shadow-2xl backdrop-blur-xl divide-y divide-slate-200/80 dark:divide-[#161e31] space-y-0 overflow-hidden tic-card ${className}`}
    >
      {/* Inline keyframes so the component stays drop-in / no tailwind.config changes needed */}
      <style>{`
        @keyframes tic-pulse-glow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.08); }
        }
        @keyframes tic-scan {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes tic-blink-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
          50% { opacity: 0.55; box-shadow: 0 0 0 6px rgba(16,185,129,0); }
        }
        @keyframes tic-blink-dot-red {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(248,113,113,0.6); }
          50% { opacity: 0.55; box-shadow: 0 0 0 6px rgba(248,113,113,0); }
        }
        @keyframes tic-fade-up {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tic-badge-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(59,130,246,0.15); }
          50% { box-shadow: 0 0 18px rgba(59,130,246,0.45); }
        }
        @keyframes tic-number-tick {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .tic-row {
          animation: tic-fade-up 0.5s ease-out both;
        }
        .tic-row:nth-child(1) { animation-delay: 0.05s; }
        .tic-row:nth-child(2) { animation-delay: 0.15s; }
        .tic-row:nth-child(3) { animation-delay: 0.25s; }
        .tic-row:nth-child(4) { animation-delay: 0.35s; }
        .tic-scan-line {
          position: absolute;
          top: 0;
          left: 0;
          height: 2px;
          width: 40%;
          background: linear-gradient(90deg, transparent, ${glowColor}, transparent);
          animation: tic-scan 3.5s linear infinite;
        }
        .tic-live-dot {
          animation: tic-blink-dot 1.6s ease-in-out infinite;
        }
        .tic-live-dot-red {
          animation: tic-blink-dot-red 1.2s ease-in-out infinite;
        }
        .tic-badge {
          animation: tic-badge-glow 2.4s ease-in-out infinite;
        }
        .tic-score {
          animation: tic-number-tick 0.4s ease-out;
        }
        @keyframes tic-arrive {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes tic-arrive-flash {
          0% { background-color: rgba(96,165,250,0.15); box-shadow: inset 0 0 0 1px rgba(96,165,250,0.35); }
          100% { background-color: transparent; box-shadow: inset 0 0 0 1px rgba(96,165,250,0); }
        }
        @keyframes tic-new-badge {
          0% { opacity: 1; transform: scale(1); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.9); }
        }
        .tic-row-live {
          animation: tic-arrive 0.45s ease-out both, tic-arrive-flash 1.8s ease-out both;
          border-radius: 0.75rem;
        }
        .tic-new-badge {
          animation: tic-new-badge 2.2s ease-out forwards;
        }
      `}</style>

      {/* Top scan-line, always running to signal "live" monitoring */}
      <div className="tic-scan-line" />

      {/* Ambient GlowLight component representing the blue/cyan glow effect, now breathing */}
      <div style={{ animation: 'tic-pulse-glow 3s ease-in-out infinite' }}>
        <GlowLight
          color={glowColor}
          position="top-1/2 right-10"
          size="w-[120px] h-[220px] sm:w-[120px] sm:h-[220px]"
          blur="blur-[80px]"
          opacity="opacity-35"
          offset="-translate-x-1/2 -translate-y-1/2"
          className="z-0 pointer-events-none"
        />
      </div>

      {/* Card Header (Top Bar) */}
      <div className="relative z-10 flex items-center justify-between pb-4">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-[#7e8eb0] tracking-[0.18em]">
          <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-[#06b6d4] stroke-[2.5]" />
          <span>{cardHeader}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-600 dark:text-[#7e8eb0]">
          <span className="w-2 h-2 rounded-full bg-[#10b981] tic-live-dot" />
          <span>{cardBadge}</span>
          <span className="text-slate-400 dark:text-[#3f4a63]">·</span>
          <span className="text-slate-500 dark:text-[#4b5875] tabular-nums">
            {String(Math.floor(elapsed / 60)).padStart(2, '0')}:
            {String(elapsed % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Card Subheader Section */}
      <div className="relative z-10 flex items-center justify-between py-4">
        <div>
          <h4 className="text-slate-900 dark:text-white text-base sm:text-lg font-semibold font-sans tracking-tight">
            {activeTab === 0
              ? 'Active Deception Traps & Agents'
              : activeTab === 1
              ? 'Real-Time Threat Classifier & Telemetry'
              : 'Containment & Forensic Remediation'}
          </h4>
          <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.12em] text-slate-500 dark:text-[#64748b] uppercase mt-1">
            {activeTab === 0
              ? 'DOCKER TRAPS · WAZUH LOG COLLECTOR'
              : activeTab === 1
              ? 'SLIDING WINDOW W=300s · SUB-150ms'
              : 'AUTOMATED FIREWALL BLOCK · SIEM SYNC'}
          </p>
        </div>
        <div className=" px-3 py-1.5 rounded-lg border border-blue-500/30 dark:border-[#2563eb]/50 bg-blue-50 dark:bg-[#1e3a8a]/20 text-blue-600 dark:text-[#60a5fa] font-mono text-xs font-semibold flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-[#3b82f6]" />
          <span>
            {activeTab === 0
              ? 'ARMED & MONITORING'
              : activeTab === 1
              ? 'ANALYZING TRAFFIC'
              : 'AUTO-CONTAINED'}
          </span>
        </div>
      </div>

      {/* Tab 0 Content: Preparation (Honeypots, Log Ingestion, Whitelists) */}
      {activeTab === 0 && (
        <div className="relative z-10 divide-y divide-slate-100 dark:divide-[#141c2e]/70 py-1 max-h-[250px] overflow-y-auto scrollbar-none">
          {/* Row 1: SSH Trap */}
          <div className="tic-row py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-[#1e3a8a]/30 border border-blue-200 dark:border-[#2563eb]/40 text-blue-600 dark:text-[#60a5fa]">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base font-sans block">
                  dev-server Honeypot Trap
                </span>
                <span className="text-slate-500 dark:text-[#64748b] font-mono text-xs block mt-0.5 tracking-wider">
                  Docker Container · SSH Port 2222
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg border border-blue-500/30 dark:border-[#2563eb]/40 bg-blue-50 dark:bg-[#1e3a8a]/20 text-blue-700 dark:text-[#60a5fa] font-mono text-xs font-semibold">
              ARMED & READY
            </span>
          </div>

          {/* Row 2: Database Trap */}
          <div className="tic-row py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-[#1e3a8a]/30 border border-blue-200 dark:border-[#2563eb]/40 text-blue-600 dark:text-[#60a5fa]">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base font-sans block">
                  db-server Honeypot Trap
                </span>
                <span className="text-slate-500 dark:text-[#64748b] font-mono text-xs block mt-0.5 tracking-wider">
                  Docker Container · Postgres Port 2223
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg border border-blue-500/30 dark:border-[#2563eb]/40 bg-blue-50 dark:bg-[#1e3a8a]/20 text-blue-700 dark:text-[#60a5fa] font-mono text-xs font-semibold">
              ARMED & READY
            </span>
          </div>

          {/* Row 3: Wazuh Log Collector */}
          <div className="tic-row py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-[#065f46]/30 border border-emerald-200 dark:border-[#10b981]/40 text-emerald-600 dark:text-[#34d399]">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base font-sans block">
                  Wazuh Log Ingestion Daemon
                </span>
                <span className="text-slate-500 dark:text-[#64748b] font-mono text-xs block mt-0.5 tracking-wider">
                  auth.log / cowrie.json Multi-Channel
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg border border-emerald-500/30 dark:border-[#10b981]/40 bg-emerald-50 dark:bg-[#065f46]/20 text-emerald-700 dark:text-[#34d399] font-mono text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] tic-live-dot" />
              STREAMING
            </span>
          </div>

          {/* Row 4: IP Whitelist Rule */}
          <div className="tic-row py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-[#164e63]/30 border border-cyan-200 dark:border-[#06b6d4]/40 text-cyan-600 dark:text-[#22d3ee]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base font-sans block">
                  Internal Subnet Whitelist
                </span>
                <span className="text-slate-500 dark:text-[#64748b] font-mono text-xs block mt-0.5 tracking-wider">
                  Safe Bypass Rules · 10.0.0.0/8
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg border border-cyan-500/30 dark:border-[#06b6d4]/40 bg-cyan-50 dark:bg-[#164e63]/20 text-cyan-700 dark:text-[#22d3ee] font-mono text-xs font-semibold">
              ACTIVE
            </span>
          </div>
        </div>
      )}

      {/* Tab 1 Content: Detection and Analysis */}
      {activeTab === 1 && (
        <div className="relative z-10 divide-y divide-slate-100 dark:divide-[#141c2e]/70 py-1 min-h-[250px]">
          {/* Row 1: Fast Path Classifier — now with a live-jittering score */}
          <div className="tic-row-live py-3.5 px-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-[#2b1419]/80 border border-rose-200 dark:border-[#521b24] text-rose-600 dark:text-[#f87171]">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base font-sans block">
                  Fast Path ML Classifier
                </span>
                <span className="text-slate-500 dark:text-[#64748b] font-mono text-xs block mt-0.5 tracking-wider">
                  8 FEATURE METRICS · W=300s
                </span>
              </div>
            </div>
            <div className="text-right">
              <span
                key={liveScore}
                className="tic-score text-xl font-bold font-mono text-rose-600 dark:text-[#f87171] block tabular-nums"
              >
                {liveScore}
                <span className="text-xs text-slate-500 dark:text-[#64748b]">/100</span>
              </span>
              <span className="text-[10px] font-mono text-rose-600 dark:text-[#f87171] font-bold flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] tic-live-dot-red" />
                CRITICAL THREAT
              </span>
            </div>
          </div>

          {/* Row 2: SSH Brute-force Anomaly — arrives after Row 1 */}
          {visibleRows >= 2 && (
            <div className="tic-row-live py-3.5 px-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-[#2b1419]/80 border border-rose-200 dark:border-[#521b24] text-rose-600 dark:text-[#f87171]">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base font-sans block">
                    SSH Brute-force Burst
                  </span>
                  <span className="text-slate-500 dark:text-[#64748b] font-mono text-xs block mt-0.5 tracking-wider">
                    Target: 185.220.101.5 (TOR Exit Node)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {visibleRows === 2 && (
                  <span className="tic-new-badge px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-100 dark:bg-[#3b82f6]/20 text-blue-600 dark:text-[#60a5fa] border border-blue-300 dark:border-[#3b82f6]/40">
                    NEW
                  </span>
                )}
                <span className="px-3 py-1 rounded-lg border border-rose-500/30 dark:border-[#85252e] bg-rose-50 dark:bg-[#3a161d]/80 text-rose-700 dark:text-[#fca5a5] font-mono text-xs font-semibold">
                  HIGH SEVERITY
                </span>
              </div>
            </div>
          )}

          {/* Row 3: Credential Stuffing Sweep — arrives after Row 2 */}
          {visibleRows >= 3 && (
            <div className="tic-row-live py-3.5 px-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-[#2a220e]/80 border border-amber-200 dark:border-[#4d3d14] text-amber-600 dark:text-[#fbbf24]">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base font-sans block">
                    Credential Stuffing Sweep
                  </span>
                  <span className="text-slate-500 dark:text-[#64748b] font-mono text-xs block mt-0.5 tracking-wider">
                    74 req/sec · Anomaly Score 0.89
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {visibleRows === 3 && (
                  <span className="tic-new-badge px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-100 dark:bg-[#3b82f6]/20 text-blue-600 dark:text-[#60a5fa] border border-blue-300 dark:border-[#3b82f6]/40">
                    NEW
                  </span>
                )}
                <span className="px-3 py-1 rounded-lg border border-amber-500/30 dark:border-[#4d3d14] bg-amber-50 dark:bg-[#2a220e]/80 text-amber-700 dark:text-[#fbbf24] font-mono text-xs font-semibold">
                  MEDIUM SEVERITY
                </span>
              </div>
            </div>
          )}

          {/* Row 4: SQL Injection Probe — arrives after Row 3 */}
          {visibleRows >= 4 && (
            <div className="tic-row-live py-3.5 px-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-[#2a220e]/80 border border-amber-200 dark:border-[#4d3d14] text-amber-600 dark:text-[#fbbf24]">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base font-sans block">
                    SQL Injection Pattern Probe
                  </span>
                  <span className="text-slate-500 dark:text-[#64748b] font-mono text-xs block mt-0.5 tracking-wider">
                    Target: 45.33.32.156 (GeoIP Probe)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {visibleRows === 4 && (
                  <span className="tic-new-badge px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-100 dark:bg-[#3b82f6]/20 text-blue-600 dark:text-[#60a5fa] border border-blue-300 dark:border-[#3b82f6]/40">
                    NEW
                  </span>
                )}
                <span className="px-3 py-1 rounded-lg border border-amber-500/30 dark:border-[#4d3d14] bg-amber-50 dark:bg-[#2a220e]/80 text-amber-700 dark:text-[#fbbf24] font-mono text-xs font-semibold">
                  DETECTED
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2 Content: Post Incident Activity */}
      {activeTab === 2 && (
        <div className="relative z-10 divide-y divide-slate-100 dark:divide-[#141c2e]/70 py-1 min-h-[250px]">
          {/* Row 1: Firewall IP Block */}
          <div className="tic-row-live py-3.5 px-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-[#2b1419]/80 border border-rose-200 dark:border-[#521b24] text-rose-600 dark:text-[#f87171]">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base font-sans block">
                  Automated Firewall IP Block
                </span>
                <span className="text-slate-500 dark:text-[#64748b] font-mono text-xs block mt-0.5 tracking-wider">
                  IP 185.220.101.5 · IPTables Synced
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg border border-rose-500/30 dark:border-[#85252e] bg-rose-50 dark:bg-[#3a161d]/80 text-rose-700 dark:text-[#fca5a5] font-mono text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] tic-live-dot-red" />
              IP QUARANTINED
            </span>
          </div>

          {/* Row 2: SIEM Event Dispatch — arrives after Row 1 */}
          {visibleRows >= 2 && (
            <div className="tic-row-live py-3.5 px-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-[#1e3a8a]/30 border border-blue-200 dark:border-[#2563eb]/40 text-blue-600 dark:text-[#60a5fa]">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base font-sans block">
                    SIEM & Datadog Event Stream
                  </span>
                  <span className="text-slate-500 dark:text-[#64748b] font-mono text-xs block mt-0.5 tracking-wider">
                    Incident Log ID #9C347A Dispatched
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {visibleRows === 2 && (
                  <span className="tic-new-badge px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-100 dark:bg-[#3b82f6]/20 text-blue-600 dark:text-[#60a5fa] border border-blue-300 dark:border-[#3b82f6]/40">
                    NEW
                  </span>
                )}
                <span className="px-3 py-1 rounded-lg border border-blue-500/30 dark:border-[#2563eb]/40 bg-blue-50 dark:bg-[#1e3a8a]/20 text-blue-700 dark:text-[#60a5fa] font-mono text-xs font-semibold">
                  LOGGED & SENT
                </span>
              </div>
            </div>
          )}

          {/* Row 3: Forensic Audit Trail — arrives after Row 2 */}
          {visibleRows >= 3 && (
            <div className="tic-row-live py-3.5 px-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-[#065f46]/30 border border-emerald-200 dark:border-[#10b981]/40 text-emerald-600 dark:text-[#34d399]">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base font-sans block">
                    Forensic Audit Trail & Graph
                  </span>
                  <span className="text-slate-500 dark:text-[#64748b] font-mono text-xs block mt-0.5 tracking-wider">
                    Evidence Artifacts Sealed & Exported
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {visibleRows === 3 && (
                  <span className="tic-new-badge px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-100 dark:bg-[#3b82f6]/20 text-blue-600 dark:text-[#60a5fa] border border-blue-300 dark:border-[#3b82f6]/40">
                    NEW
                  </span>
                )}
                <span className="px-3 py-1 rounded-lg border border-emerald-500/30 dark:border-[#10b981]/40 bg-emerald-50 dark:bg-[#065f46]/20 text-emerald-700 dark:text-[#34d399] font-mono text-xs font-semibold">
                  REPORT READY
                </span>
              </div>
            </div>
          )}

          {/* Row 4: Security Baseline Restored — arrives after Row 3 */}
          {visibleRows >= 4 && (
            <div className="tic-row-live py-3.5 px-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-[#065f46]/30 border border-emerald-200 dark:border-[#10b981]/40 text-emerald-600 dark:text-[#34d399]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base font-sans block">
                    Security Baseline Restored
                  </span>
                  <span className="text-slate-500 dark:text-[#64748b] font-mono text-xs block mt-0.5 tracking-wider">
                    Threat Vector Isolated · Systems Operational
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {visibleRows === 4 && (
                  <span className="tic-new-badge px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-100 dark:bg-[#3b82f6]/20 text-blue-600 dark:text-[#60a5fa] border border-blue-300 dark:border-[#3b82f6]/40">
                    NEW
                  </span>
                )}
                <span className="px-3 py-1 rounded-lg border border-emerald-500/30 dark:border-[#10b981]/40 bg-emerald-50 dark:bg-[#065f46]/20 text-emerald-700 dark:text-[#34d399] font-mono text-xs font-semibold">
                  RESOLVED
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card Footer */}
      <div className="relative z-10 pt-4 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-500 dark:text-[#64748b] tracking-[0.15em] uppercase font-semibold">
          AUTOMATED INCIDENT LIFECYCLE
        </span>
        <div className="text-emerald-600 dark:text-[#10b981] font-semibold flex items-center gap-1.5 tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#10b981]" />
          <span>SOC OPERATIONAL</span>
        </div>
      </div>
    </div>
  );
};

export default ThreatIntelligenceCard;