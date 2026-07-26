import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { Terminal as TerminalIcon, Flame, Cpu, ShieldAlert, RefreshCw, Trash2 } from 'lucide-react';

interface TerminalWindowProps {
  onAttackTriggered?: (scenario: {
    name: string;
    threatScore: number;
    reqPerSec: number;
    ip: string;
    location: string;
    isTor: boolean;
    ruleId: number;
  }) => void;
}

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SANDBOX_API_URL) ||
  'http://localhost:8000';

const WS_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SANDBOX_WS_URL) ||
  'ws://localhost:8000';

const PRESET_SCENARIOS = [
  {
    label: 'Run SSH Brute Force',
    icon: Flame,
    command: 'python3 attack_sim.py --type ssh_bruteforce --target 192.168.1.105\r',
    scenarioData: {
      name: 'SSH Brute-Force (Cowrie Trap)',
      threatScore: 94,
      reqPerSec: 480,
      ip: '185.220.101.5',
      location: 'Frankfurt, Germany',
      isTor: true,
      ruleId: 5710,
    },
  },
  {
    label: 'Simulate Anomaly',
    icon: Cpu,
    command: './attack_sim.sh --anomaly-detection --rate 500req/s\r',
    scenarioData: {
      name: 'High-Velocity Anomaly Probe',
      threatScore: 88,
      reqPerSec: 520,
      ip: '45.33.32.156',
      location: 'Dallas, United States',
      isTor: false,
      ruleId: 31101,
    },
  },
  {
    label: 'Trigger Policy Violation',
    icon: ShieldAlert,
    command: 'curl -X POST http://localhost:8000/api/v1/alert --data \'{"rule_id": 5710, "level": 12}\'\r',
    scenarioData: {
      name: 'Direct Policy Violation Alert',
      threatScore: 98,
      reqPerSec: 120,
      ip: '198.51.100.42',
      location: 'Amsterdam, Netherlands',
      isTor: true,
      ruleId: 100200,
    },
  },
];

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ onAttackTriggered }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'offline'>('connecting');

  useEffect(() => {
    if (!terminalRef.current) return;

    // 1. Setup xterm instance with Cyber Theme
    const term = new XTerminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: "'Fira Code', ui-monospace, monospace",
      fontSize: 13,
      lineHeight: 1.2,
      theme: {
        background: '#0B0F19',
        foreground: '#00FF99',
        cursor: '#00FF99',
        cursorAccent: '#0B0F19',
        selectionBackground: 'rgba(52, 211, 153, 0.3)',
        black: '#0B0F19',
        red: '#F43F5E',
        green: '#34D399',
        yellow: '#FBBF24',
        blue: '#22D3EE',
        magenta: '#A855F7',
        cyan: '#38BDF8',
        white: '#E2E8F0',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    term.writeln('\x1b[33m[+] Initializing secure sandbox environment...\x1b[0m');

    // Attach responsive resize listener
    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch (e) {
        // ignore resize during unmount
      }
    };
    window.addEventListener('resize', handleResize);

    // 2. Initialize Session API & WebSocket Connection
    let isComponentMounted = true;

    const initSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!isComponentMounted) return;

        const { session_id, ws_url } = data;
        sessionIdRef.current = session_id;

        // Construct WS Endpoint
        const wsTarget = ws_url.startsWith('ws')
          ? ws_url
          : `${WS_BASE_URL}${ws_url.startsWith('/') ? '' : '/'}${ws_url}`;

        term.writeln(`\x1b[36m[*] Session created: ${session_id}. Connecting to WebSocket...\x1b[0m`);

        const ws = new WebSocket(wsTarget);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isComponentMounted) return;
          setConnectionStatus('connected');
          term.writeln('\x1b[32m[+] Connected to isolated Linux container. Ready.\x1b[0m\r\n');
        };

        // Container -> xterm
        ws.onmessage = (e) => {
          term.write(e.data);
        };

        ws.onerror = (err) => {
          console.warn('WebSocket connection failed, falling back to interactive sandbox shell mode.', err);
          if (isComponentMounted) setConnectionStatus('offline');
        };

        ws.onclose = () => {
          if (isComponentMounted && connectionStatus === 'connected') {
            term.writeln('\r\n\x1b[31m[!] Session closed by remote host.\x1b[0m');
          }
        };

        // xterm -> Container
        term.onData((inputData) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(inputData);
          }
        });
      } catch (err) {
        if (!isComponentMounted) return;
        setConnectionStatus('offline');
        term.writeln('\x1b[33m[!] Microservice API offline. Falling back to local interactive terminal session.\x1b[0m');
        term.writeln('\x1b[32mroot@lureguard-sandbox:~# \x1b[0m');

        // Local interactive fallback loop for xterm input
        let currentLine = '';
        term.onData((data) => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

          if (data === '\r') {
            // Enter key
            term.writeln('');
            const trimmed = currentLine.trim();
            if (trimmed === 'clear') {
              term.clear();
            } else if (trimmed === 'help' || trimmed === 'man lureguard') {
              term.writeln('\x1b[36mAvailable Commands:\x1b[0m');
              term.writeln('  help                  - Show this help menu');
              term.writeln('  clear                 - Clear terminal screen');
              term.writeln('  status                - Check pipeline status');
              term.writeln('  attack --ssh          - Run SSH Brute Force scenario');
            } else if (trimmed === 'status') {
              term.writeln('\x1b[32m[✓] Pipeline Engine: ONLINE (<150ms Fast Path)\x1b[0m');
            } else if (trimmed) {
              term.writeln(`\x1b[31mcommand not found: ${trimmed}. Type "help" for menu.\x1b[0m`);
            }
            currentLine = '';
            term.write('\x1b[32mroot@lureguard-sandbox:~# \x1b[0m');
          } else if (data === '\u007F') {
            // Backspace
            if (currentLine.length > 0) {
              currentLine = currentLine.slice(0, -1);
              term.write('\b \b');
            }
          } else {
            currentLine += data;
            term.write(data);
          }
        });
      }
    };

    initSession();

    // 4. On Component Unmount / Cleanup (CRITICAL)
    return () => {
      isComponentMounted = false;
      window.removeEventListener('resize', handleResize);

      // Close WebSocket
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Send DELETE request to terminate Docker session
      if (sessionIdRef.current) {
        const activeSessionId = sessionIdRef.current;
        fetch(`${API_BASE_URL}/api/sessions/${activeSessionId}`, {
          method: 'DELETE',
        }).catch((err) => console.log('Session cleanup request sent:', err));
      }

      // Dispose xterm
      term.dispose();
    };
  }, []);

  // Preset Scenario Handler
  const handleRunPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    if (xtermRef.current) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(preset.command);
      } else {
        xtermRef.current.writeln(`\x1b[32mroot@lureguard-sandbox:~# \x1b[0m${preset.command.trim()}`);
        xtermRef.current.writeln('\x1b[33m[+] Executing attack simulation scenario...\x1b[0m');
        xtermRef.current.writeln('\x1b[31m[!] INBOUND_CONN: Target IP 192.168.1.105 (Cowrie Trap)\x1b[0m');
        xtermRef.current.writeln('\x1b[32m[✓] Fast Path Threat Score: ' + preset.scenarioData.threatScore + '/100 -> Telegram Alert Dispatched!\x1b[0m\r\n');
        xtermRef.current.write('\x1b[32mroot@lureguard-sandbox:~# \x1b[0m');
      }
    }

    if (onAttackTriggered) {
      onAttackTriggered(preset.scenarioData);
    }
  };

  return (
    <div className="w-full space-y-4 text-left dir-ltr">
      {/* Preset Action Buttons Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-slate-400 font-semibold mr-1">Attack Scenarios:</span>
          {PRESET_SCENARIOS.map((scenario, idx) => {
            const Icon = scenario.icon;
            return (
              <button
                key={idx}
                onClick={() => handleRunPreset(scenario)}
                className="px-3 py-2 rounded-lg font-mono text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-400/50 hover:shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all flex items-center gap-2"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{scenario.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => xtermRef.current?.clear()}
            className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
            title="Clear Terminal Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Embedded Terminal Container (macOS / Linux Window Top Bar) */}
      <div className="glass-panel rounded-2xl border border-slate-800/90 overflow-hidden shadow-[0_0_50px_rgba(8,11,16,0.9)] glow-border-emerald">
        {/* Top Header Bar with 3 Window Dots */}
        <div className="bg-[#080B12] px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F43F5E] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#FBBF24] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#34D399] inline-block"></span>
            <span className="ml-3 font-mono text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              root@lureguard-sandbox:~
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            {connectionStatus === 'connected' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                WS ONLINE
              </span>
            ) : connectionStatus === 'connecting' ? (
              <span className="text-amber-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                CONNECTING...
              </span>
            ) : (
              <span className="text-slate-400">STANDALONE SHELL</span>
            )}
          </div>
        </div>

        {/* XTerm Container Element */}
        <div className="p-3 bg-[#0B0F19] min-h-[380px] w-full relative">
          <div ref={terminalRef} className="w-full h-[360px]" />
        </div>
      </div>
    </div>
  );
};
