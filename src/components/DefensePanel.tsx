import React from 'react';
import { ShieldAlert, Activity, Globe, Send } from 'lucide-react';

export type ScenarioData = {
  name: string;
  threatScore: number;
  reqPerSec: number;
  ip: string;
  location: string;
  isTor: boolean;
  ruleId: number;
};

interface DefensePanelProps {
  scenario?: ScenarioData;
}

const DEFAULT_SCENARIO: ScenarioData = {
  name: 'SSH Brute-Force (Cowrie Trap)',
  threatScore: 94,
  reqPerSec: 480,
  ip: '185.220.101.5',
  location: 'Frankfurt, Germany',
  isTor: true,
  ruleId: 5710,
};

export const DefensePanel: React.FC<DefensePanelProps> = ({ scenario = DEFAULT_SCENARIO }) => {
  const scoreColor =
    scenario.threatScore >= 90
      ? 'text-rose-400 border-rose-500/40 bg-rose-950/40 glow-text-rose'
      : scenario.threatScore >= 70
      ? 'text-amber-400 border-amber-500/40 bg-amber-950/40'
      : 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';

  return (
    <div className="w-full space-y-6 text-left dir-ltr">
      {/* Header Badge */}
      <div className="flex items-center justify-between min-h-[40px]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
            DEFENSE PANEL // LIVE TRIAGE
          </span>
        </div>
        <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono text-[10px] font-bold animate-pulse">
          REAL-TIME RESPONSE
        </span>
      </div>

      {/* Threat Score & Velocity Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Threat Score Card */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-cyber-card/60 relative overflow-hidden">
          <span className="text-[11px] font-mono text-slate-400 block mb-2">THREAT SCORE METER</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-mono font-bold ${scoreColor.split(' ')[0]}`}>
              {scenario.threatScore}
            </span>
            <span className="text-sm font-mono text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500"
              style={{ width: `${scenario.threatScore}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-rose-400 font-bold mt-2 block uppercase tracking-wider">
            CRITICAL SEVERITY LEVEL
          </span>
        </div>

        {/* Attack Velocity Card */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-cyber-card/60 relative overflow-hidden">
          <span className="text-[11px] font-mono text-slate-400 block mb-2">ATTACK VELOCITY</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-amber-400">
              {scenario.reqPerSec}
            </span>
            <span className="text-xs font-mono text-slate-400">req / sec</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-mono text-amber-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>High Frequency Burst</span>
          </div>
        </div>
      </div>

      {/* GeoIP & Infrastructure Card */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-cyber-card/60 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            ATTACKER GEOIP TELEMETRY
          </span>
          {scenario.isTor && (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono text-[10px] font-bold">
              TOR EXIT NODE DETECTED
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">SOURCE IP ADDRESS</span>
            <span className="text-white font-bold">{scenario.ip}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">GEOGRAPHIC LOCATION</span>
            <span className="text-cyan-400 font-semibold">{scenario.location}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">WAZUH RULE ID</span>
            <span className="text-amber-400">Rule #{scenario.ruleId}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">PIPELINE ACTION</span>
            <span className="text-emerald-400 font-bold">QUARANTINED & ISOLATED</span>
          </div>
        </div>
      </div>

      {/* Mock Telegram Alert Card */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 bg-cyber-card/70 relative overflow-hidden glow-border-cyan space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            TELEGRAM SOC ALERT DISPATCHED
          </span>
          <span className="text-[10px] font-mono text-slate-400">@LureGuardAlertBot</span>
        </div>

        <div className="bg-slate-950/90 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed space-y-1.5 select-text">
          <div className="text-rose-400 font-bold">🚨 LUREGUARD HIGH PRIORITY ALERT</div>
          <div><span className="text-slate-400">Scenario:</span> {scenario.name}</div>
          <div><span className="text-slate-400">Attacker IP:</span> {scenario.ip} ({scenario.location})</div>
          <div><span className="text-slate-400">Threat Score:</span> <span className="text-rose-400 font-bold">{scenario.threatScore}/100</span></div>
          <div><span className="text-slate-400">Action:</span> <span className="text-emerald-400">Redirected to Honeypot + IP Banned</span></div>
        </div>
      </div>
    </div>
  );
};
