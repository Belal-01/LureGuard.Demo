import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Activity,
  Globe,
  Radio,
  RefreshCw,
  Cpu,
  Lock,
  Send,
  X,
  FileText,
  Ban,
  CheckCircle2,
  Shield,
  Layers,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { AttackScenario } from '../data/attackScenarios';
import { ATTACK_SCENARIOS } from '../data/attackScenarios';

interface DefensePanelProps {
  activeScenario?: AttackScenario;
  simulatedStage?: number; // 0: Idle/TCP, 1: Burst/GeoIP, 2: ML Features, 3: Enforced & Toast
}

export const DefensePanel: React.FC<DefensePanelProps> = ({
  activeScenario = ATTACK_SCENARIOS[0],
  simulatedStage = 3,
}) => {
  const [telegramToast, setTelegramToast] = useState<{ visible: boolean; data: AttackScenario } | null>(null);
  const [isToastExpanded, setIsToastExpanded] = useState<boolean>(false);
  const [analystNotice, setAnalystNotice] = useState<string | null>(null);
  const isFirstLoadRef = React.useRef(true);

  // Trigger Telegram Toast Alert ONLY when stage 3 is reached after user interaction (NOT on page load/reload)
  useEffect(() => {
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      return;
    }

    if (simulatedStage === 3 && activeScenario) {
      setTelegramToast({ visible: true, data: activeScenario });
      setIsToastExpanded(false);
      const timer = setTimeout(() => {
        setTelegramToast(null);
      }, 8000);
      return () => clearTimeout(timer);
    } else if (simulatedStage < 3) {
      setTelegramToast(null);
      setIsToastExpanded(false);
    }
  }, [simulatedStage, activeScenario]);

  // Progressive metric values based on simulatedStage
  const currentScore =
    simulatedStage === 0 ? 0 : simulatedStage === 1 ? 35 : activeScenario.threatScore;

  const currentVelocity =
    simulatedStage === 0 ? 0 : simulatedStage === 1 ? Math.floor(activeScenario.reqPerSec * 0.4) : activeScenario.reqPerSec;

  const scoreColor =
    currentScore >= 90
      ? 'text-rose-400 border-rose-500/40 bg-rose-950/40 glow-text-rose'
      : currentScore >= 70
      ? 'text-amber-400 border-amber-500/40 bg-amber-950/40'
      : currentScore > 0
      ? 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40'
      : 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';

  const handleAnalystAction = (actionName: string) => {
    setAnalystNotice(`[SOC Action Executed]: ${actionName} for IP ${activeScenario.ip}`);
    setTimeout(() => setAnalystNotice(null), 4000);
  };

  return (
    <div className="w-full space-y-3 text-left dir-ltr font-sans">
      {/* Block 1: Top Metric Bar (Progressive Threat Score & Velocity) */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-cyber-card/80 flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">ACTIVE INCIDENT TRIAGE</span>
            <h3 className="font-mono text-xs font-bold text-white truncate max-w-xs">{activeScenario.name}</h3>
          </div>
        </div>

        {/* Dynamic Threat Score Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-[10px] text-slate-400">SCORE:</span>
            <span className={`text-2xl font-bold transition-all duration-500 ${scoreColor.split(' ')[0]}`}>{currentScore}</span>
            <span className="text-xs text-slate-500">/100</span>
          </div>

          {/* Dynamic Velocity Badge */}
          <div className="flex items-baseline gap-1.5 font-mono bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-400 transition-all duration-300">{currentVelocity}</span>
            <span className="text-[10px] text-slate-400">req/s</span>
          </div>

          <span
            className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold transition-colors ${
              simulatedStage === 3
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                : simulatedStage === 2
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
            }`}
          >
            {simulatedStage === 3 ? activeScenario.severity : simulatedStage >= 1 ? 'EVALUATING...' : 'MONITORING'}
          </span>
        </div>
      </div>

      {/* Grid Row: Block 2 & Block 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Block 2: MITRE ATT&CK & ML Feature Matrix (Progressive Extraction) */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-cyber-card/60 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              MITRE & ML FEATURE VECTOR (f1–f8)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {simulatedStage >= 2 ? 'W=300s (Extracted)' : 'Extracting...'}
            </span>
          </div>

          {/* MITRE Badges */}
          <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
            {simulatedStage >= 2 ? (
              <>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-fadeIn">
                  {activeScenario.mitreTactic}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 animate-fadeIn">
                  {activeScenario.mitreTechnique}
                </span>
              </>
            ) : (
              <span className="text-slate-500 text-[10px] italic">Awaiting packet window...</span>
            )}
          </div>

          {/* 8 ML Feature Vector Pills (Reveals on Stage 2) */}
          <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">f1 (Attempts)</span>
              <span className="text-amber-400 font-bold">{simulatedStage >= 2 ? activeScenario.features.f1_attempts : '--'}</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">f2 (Failed Ratio)</span>
              <span className="text-rose-400 font-bold">{simulatedStage >= 2 ? activeScenario.features.f2_failedRatio : '--'}</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">f3 (Distinct Users)</span>
              <span className="text-cyan-400 font-bold">{simulatedStage >= 2 ? activeScenario.features.f3_distinctUser : '--'}</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">f4 (Burst Max)</span>
              <span className="text-amber-400 font-bold">{simulatedStage >= 2 ? activeScenario.features.f4_burstMax : '--'}</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">f5 (Mean Inter)</span>
              <span className="text-slate-300 font-bold">{simulatedStage >= 2 ? activeScenario.features.f5_meanInterMs : '--'}</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">f6 (StdDev Timing)</span>
              <span className="text-blue-400 font-bold">{simulatedStage >= 2 ? activeScenario.features.f6_stddevInterMs : '--'}</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">f7 (Hour Weight)</span>
              <span className="text-slate-300 font-bold">{simulatedStage >= 2 ? activeScenario.features.f7_hourWeight : '--'}</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">f8 (Whitelisted)</span>
              <span className="text-blue-400 font-bold">{simulatedStage >= 2 ? activeScenario.features.f8_isWhitelisted : '--'}</span>
            </div>
          </div>
        </div>

        {/* Block 3: Attacker GeoIP & Honeypot Trap Routing (Reveals on Stage 1 & Stage 3) */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-cyber-card/60 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              GEOIP & HONEYPOT TRAP ROUTING
            </span>
            {simulatedStage >= 1 && activeScenario.isTor && (
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono text-[10px] font-bold animate-fadeIn">
                TOR EXIT NODE
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">ATTACKER IP</span>
              <span className="text-white font-bold">{simulatedStage >= 1 ? activeScenario.ip : 'Listening...'}</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">LOCATION</span>
              <span className="text-cyan-400 font-bold truncate block">{simulatedStage >= 1 ? activeScenario.location : '--'}</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">REPUTATION SCORE</span>
              <span className="text-rose-400 font-bold">{simulatedStage >= 1 ? activeScenario.abuseIpScore : '--'}</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">RULE ID</span>
              <span className="text-amber-400 font-bold">{simulatedStage >= 1 ? activeScenario.ruleId : '--'}</span>
            </div>
          </div>

          {/* Honeypot Route & Action (Locks in on Stage 3) */}
          <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">TARGET HONEYPOT:</span>
              <span className="text-blue-400 font-bold">{simulatedStage >= 3 ? activeScenario.targetHoneypot : 'Pass-Through'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">PIPELINE ACTION:</span>
              <span className="text-rose-400 font-bold">{simulatedStage >= 3 ? activeScenario.pipelineAction : 'ANALYZING TRAFFIC'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Block 4: Real-Time Incident Timeline (Step-by-Step Highlight) */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-cyber-card/60 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <span className="text-xs font-mono text-blue-400 font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            REAL-TIME INCIDENT TIMELINE
          </span>
          <span className="text-[10px] font-mono text-slate-400">Progressive Sequence (Stage {simulatedStage + 1}/4)</span>
        </div>

        {/* 4 Horizontal Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
          {activeScenario.timeline.map((item, idx) => {
            const isCompleted = idx <= simulatedStage;
            const isCurrent = idx === simulatedStage;
            return (
              <div
                key={idx}
                className={`p-2 rounded-lg border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-blue-950/80 border-blue-500/60 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] glow-border-blue'
                    : isCompleted
                    ? 'bg-slate-900/90 border-slate-700 text-slate-200'
                    : 'bg-slate-950/50 border-slate-800/60 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold ${isCompleted ? 'text-blue-400' : 'text-slate-600'}`}>
                    STEP {item.step}
                  </span>
                  <span className="text-[9px] text-slate-500">{item.time}</span>
                </div>
                <div className="font-bold text-white text-[11px] truncate">{item.title}</div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">{item.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Analyst Action Buttons Bar */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleAnalystAction('Permanent Firewall IP Ban')}
              className="px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>[ ⛔ Ban IP ]</span>
            </button>

            <button
              onClick={() => handleAnalystAction('LLM Incident Report PDF Generated')}
              className="px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>[ 📄 LLM PDF Report ]</span>
            </button>

            <button
              onClick={() => handleAnalystAction('Flush Honeypot DNAT Session')}
              className="px-3 py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>[ 🔄 Flush Trap ]</span>
            </button>
          </div>

          {analystNotice && (
            <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded border border-blue-500/30 animate-pulse">
              {analystNotice}
            </span>
          )}
        </div>
      </div>

      {/* Floating Telegram Toast Alert (Appears ONLY on Stage 3 with slide-in left animation) */}
      {telegramToast && telegramToast.visible && (
        <div className="fixed top-10 right-6 z-50 w-80 sm:w-96 glass-panel p-3.5 rounded-xl border border-blue-500/50 bg-cyber-card/95 backdrop-blur-xl shadow-[0_0_35px_rgba(59,130,246,0.35)] glow-border-blue animate-slide-in-right text-left dir-ltr transition-all duration-300">
          <div className={`flex items-center justify-between transition-all duration-200 ${isToastExpanded ? 'border-b border-slate-800 pb-2.5 mb-2.5' : 'pb-0 mb-0'}`}>
            <span
              onClick={() => setIsToastExpanded(!isToastExpanded)}
              className="text-xs font-mono font-bold text-blue-400 flex items-center gap-1.5 cursor-pointer select-none hover:text-blue-300 transition-colors"
              title="Click to toggle details"
            >
              <Send className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              TELEGRAM SOC ALERT DISPATCHED
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsToastExpanded(!isToastExpanded)}
                className="text-slate-400 hover:text-white px-1.5 py-1 rounded hover:bg-slate-800 transition-colors flex items-center gap-1 text-[10px] font-mono border border-slate-800"
                aria-label={isToastExpanded ? "Collapse Alert Body" : "Expand Alert Body"}
                title={isToastExpanded ? "Collapse message" : "Expand message"}
              >
               {/*  <span className="hidden sm:inline text-slate-300">{isToastExpanded ? "Hide" : "Show Details"}</span>    */} 
                {isToastExpanded ? <ChevronUp className="w-3.5 h-3.5 text-blue-400" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-400" />}
              </button>
              <button
                onClick={() => setTelegramToast(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                aria-label="Dismiss Telegram Alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isToastExpanded && (
            <div className="bg-slate-950/90 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed space-y-1 select-text animate-fadeIn">
              <div className="text-rose-400 font-bold flex items-center justify-between">
                <span>🚨 LUREGUARD HIGH PRIORITY ALERT</span>
                <span className="text-[10px] text-slate-500 font-mono">@LureGuardAlertBot</span>
              </div>
              <div><span className="text-slate-400">Target IP / Event:</span> {telegramToast.data.ip} ({telegramToast.data.location})</div>
              <div><span className="text-slate-400">Threat Score:</span> <span className="text-rose-400 font-bold">{telegramToast.data.threatScore}/100</span></div>
              <div><span className="text-slate-400">Rule ID:</span> <span className="text-amber-400">{telegramToast.data.ruleId}</span></div>
              <div><span className="text-slate-400">Action:</span> <span className="text-blue-400 font-bold">{telegramToast.data.pipelineAction}</span></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
