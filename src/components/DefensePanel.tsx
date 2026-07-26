import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Activity, Globe, Send, Radio, RefreshCw, X } from 'lucide-react';

export type ScenarioData = {
  name: string;
  threatScore: number;
  reqPerSec: number;
  ip: string;
  location: string;
  isTor: boolean;
  ruleId: number | string;
  pipelineAction?: string;
  timestamp?: number;
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
  ruleId: 'Rule #5710',
  pipelineAction: 'QUARANTINED & ISOLATED',
};

const TRIAGE_WS_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_TRIAGE_WS_URL) ||
  'ws://localhost:8085/ws/live-triage';

const TRIAGE_API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_TRIAGE_API_URL) ||
  'http://localhost:8085/api/triage/latest-attack';

export const DefensePanel: React.FC<DefensePanelProps> = ({ scenario = DEFAULT_SCENARIO }) => {
  const [liveData, setLiveData] = useState<ScenarioData>(scenario);
  const [sourceMode, setSourceMode] = useState<'ws' | 'rest' | 'preset'>('preset');
  const [telegramToast, setTelegramToast] = useState<{ visible: boolean; data: ScenarioData } | null>(null);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dismissedKeysRef = useRef<Set<string>>(new Set());

  // Helper to generate a unique key for an alert payload
  const getAlertKey = (data: ScenarioData) => {
    return `${data.ip}-${data.ruleId}-${data.threatScore}`;
  };

  const handleDismiss = (keyToDismiss?: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }

    if (telegramToast?.data) {
      const key = keyToDismiss || getAlertKey(telegramToast.data);
      dismissedKeysRef.current.add(key);
    }

    setTelegramToast(null);
  };

  const triggerToast = (data: ScenarioData) => {
    const alertKey = getAlertKey(data);

    // If user manually dismissed this exact alert before, do not re-show it!
    if (dismissedKeysRef.current.has(alertKey)) {
      return;
    }

    // Clear any existing timer
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setTelegramToast({ visible: true, data });

    // Auto dismiss after 6 seconds (6000ms)
    toastTimerRef.current = setTimeout(() => {
      setTelegramToast(null);
      toastTimerRef.current = null;
    }, 6000);
  };

  // Update when scenario prop changes (from Sandbox presets/CLI)
  useEffect(() => {
    if (scenario) {
      const updatedData: ScenarioData = {
        ...scenario,
        pipelineAction: scenario.pipelineAction || 'QUARANTINED & ISOLATED',
      };
      setLiveData(updatedData);

      // Trigger Telegram Toast Alert on scenario run if score is critical or action includes alert
      const action = (updatedData.pipelineAction || '').toLowerCase();
      if (action.includes('alert') || action.includes('quarantined') || updatedData.threatScore >= 80) {
        triggerToast(updatedData);
      }
    }
  }, [scenario]);

  // Connect to Live Python Server Endpoints (WebSocket + HTTP REST API Fallback)
  useEffect(() => {
    let ws: WebSocket | null = null;
    let isMounted = true;

    // 1. Initial HTTP REST API Fetch
    const fetchLatestAttack = async () => {
      try {
        const res = await fetch(TRIAGE_API_URL);
        if (!res.ok) return;
        const json = await res.json();
        if (!isMounted) return;

        const payload = json.data || json;
        if (payload && payload.source_ip) {
          const fetchedData: ScenarioData = {
            name: payload.scenario_name || 'Live PostgreSQL Attack Stream',
            threatScore: payload.threat_score ?? 94,
            reqPerSec: payload.velocity ?? 480,
            ip: payload.source_ip,
            location: payload.location || 'Unknown Location',
            isTor: (payload.location && payload.location.toLowerCase().includes('tor')) || payload.source_ip.startsWith('185.220'),
            ruleId: payload.wazuh_rule_id || 'Rule #5710',
            pipelineAction: payload.pipeline_action || 'QUARANTINED & ISOLATED',
          };
          setLiveData(fetchedData);
          setSourceMode('rest');

          // Trigger Telegram Toast Alert if response action contains alert/quarantine
          const actionStr = (fetchedData.pipelineAction || '').toLowerCase();
          if (actionStr.includes('alert') || actionStr.includes('quarantined') || fetchedData.threatScore >= 80) {
            triggerToast(fetchedData);
          }
        }
      } catch (err) {
        // HTTP server offline, keep preset state
      }
    };

    fetchLatestAttack();

    // 2. Open Continuous WebSocket Connection
    try {
      ws = new WebSocket(TRIAGE_WS_URL);

      ws.onopen = () => {
        if (isMounted) setSourceMode('ws');
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const json = JSON.parse(event.data);
          const payload = json.data || json;

          if (payload && (payload.source_ip || payload.threat_score !== undefined)) {
            const wsData: ScenarioData = {
              name: payload.scenario_name || 'Live PostgreSQL Attack Stream',
              threatScore: payload.threat_score ?? 94,
              reqPerSec: payload.velocity ?? 480,
              ip: payload.source_ip || '185.220.101.5',
              location: payload.location || 'Frankfurt, Germany',
              isTor: (payload.location && payload.location.toLowerCase().includes('tor')) || (payload.source_ip && payload.source_ip.startsWith('185.220')),
              ruleId: payload.wazuh_rule_id || 'Rule #5710',
              pipelineAction: payload.pipeline_action || 'QUARANTINED & ISOLATED',
            };

            setLiveData(wsData);
            setSourceMode('ws');

            // Check if action contains 'alert' or threat score is high -> Show floating Telegram Toast in bottom-right corner!
            const actionStr = (wsData.pipelineAction || '').toLowerCase();
            const actionField = (payload.action || payload.pipeline_action || '').toLowerCase();
            if (
              actionStr.includes('alert') ||
              actionField.includes('alert') ||
              actionStr.includes('quarantined') ||
              wsData.threatScore >= 80
            ) {
              triggerToast(wsData);
            }
          }
        } catch (e) {
          console.warn('Invalid JSON payload received from triage WebSocket:', e);
        }
      };

      ws.onerror = () => {
        if (isMounted && sourceMode === 'ws') setSourceMode('preset');
      };

      ws.onclose = () => {
        if (isMounted && sourceMode === 'ws') setSourceMode('preset');
      };
    } catch (err) {
      // WS error
    }

    return () => {
      isMounted = false;
      if (ws) ws.close();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const activeData = liveData || scenario;

  const scoreColor =
    activeData.threatScore >= 90
      ? 'text-rose-400 border-rose-500/40 bg-rose-950/40 glow-text-rose'
      : activeData.threatScore >= 70
      ? 'text-amber-400 border-amber-500/40 bg-amber-950/40'
      : 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';

  return (
    <div className="w-full pt-18 space-y-6 text-left dir-ltr">
      {/* Header Badge & Data Source Indicator */}
      <div className="flex items-center justify-between min-h-[40px]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
            DEFENSE PANEL // LIVE TRIAGE
          </span>
        </div>

        {sourceMode === 'ws' ? (
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold flex items-center gap-1.5 glow-border-emerald">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            LIVE WS STREAM (8085)
          </span>
        ) : sourceMode === 'rest' ? (
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono text-[10px] font-bold flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            REST API (PostgreSQL)
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono text-[10px] font-bold animate-pulse">
            REAL-TIME RESPONSE
          </span>
        )}
      </div>

      {/* Threat Score & Velocity Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Threat Score Card */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-cyber-card/60 relative overflow-hidden">
          <span className="text-[11px] font-mono text-slate-400 block mb-2">THREAT SCORE METER</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-mono font-bold ${scoreColor.split(' ')[0]}`}>
              {activeData.threatScore}
            </span>
            <span className="text-sm font-mono text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500"
              style={{ width: `${activeData.threatScore}%` }}
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
              {activeData.reqPerSec}
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
          {activeData.isTor && (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono text-[10px] font-bold">
              TOR EXIT NODE DETECTED
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">SOURCE IP ADDRESS</span>
            <span className="text-white font-bold">{activeData.ip}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">GEOGRAPHIC LOCATION</span>
            <span className="text-cyan-400 font-semibold">{activeData.location}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">WAZUH RULE ID</span>
            <span className="text-amber-400">
              {typeof activeData.ruleId === 'number' ? `Rule #${activeData.ruleId}` : activeData.ruleId}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">PIPELINE ACTION</span>
            <span className="text-emerald-400 font-bold uppercase">{activeData.pipelineAction || 'QUARANTINED & ISOLATED'}</span>
          </div>
        </div>
      </div>

      {/* Floating Telegram Toast Alert (Appears with slide-in animation from right & auto-dismisses after 6 seconds) */}
      {telegramToast && telegramToast.visible && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 glass-panel p-4 rounded-xl border border-cyan-500/50 bg-cyber-card/95 backdrop-blur-xl shadow-[0_0_35px_rgba(34,211,238,0.35)] glow-border-cyan space-y-2.5 animate-slide-in-right text-left dir-ltr">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              TELEGRAM SOC ALERT DISPATCHED
            </span>
            <button
              onClick={() => handleDismiss()}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
              title="Dismiss Alert"
              aria-label="Dismiss Telegram Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-950/90 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed space-y-1 select-text">
            <div className="text-rose-400 font-bold flex items-center justify-between">
              <span>🚨 LUREGUARD HIGH PRIORITY ALERT</span>
              <span className="text-[10px] text-slate-500 font-mono">@LureGuardAlertBot</span>
            </div>
            <div><span className="text-slate-400">Target IP / Event:</span> {telegramToast.data.ip} ({telegramToast.data.location})</div>
            <div><span className="text-slate-400">Threat Score:</span> <span className="text-rose-400 font-bold">{telegramToast.data.threatScore}/100</span></div>
            <div><span className="text-slate-400">Rule ID:</span> <span className="text-amber-400">{typeof telegramToast.data.ruleId === 'number' ? `Rule #${telegramToast.data.ruleId}` : telegramToast.data.ruleId}</span></div>
            <div><span className="text-slate-400">Action:</span> <span className="text-emerald-400 font-bold">{telegramToast.data.pipelineAction || 'QUARANTINED & ISOLATED'}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
