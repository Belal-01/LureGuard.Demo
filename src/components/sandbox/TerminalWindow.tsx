import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { Terminal as TerminalIcon, Flame, Cpu, ShieldAlert, Trash2, Play } from 'lucide-react';
import type { AttackScenario } from '../../data/attackScenarios';
import { ATTACK_SCENARIOS } from '../../data/attackScenarios';

interface TerminalWindowProps {
  activeScenario?: AttackScenario;
  onSelectScenario?: (scenarioId: string) => void;
}

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SANDBOX_API_URL) ||
  'http://localhost:8000';

const WS_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SANDBOX_WS_URL) ||
  'ws://localhost:8000';

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  activeScenario = ATTACK_SCENARIOS[0],
  onSelectScenario,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'offline'>('offline');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm instance
    const term = new XTerminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: "'Fira Code', ui-monospace, monospace",
      fontSize: 12,
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

    term.writeln('\x1b[33m[+] Initializing LureGuard Interactive Sandbox Shell...\x1b[0m');
    term.writeln('\x1b[36m[*] Select an attack scenario above or type custom commands below.\x1b[0m');
    term.write('\r\n\x1b[32muser@lureguard-sandbox:~$ \x1b[0m');

    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch (e) {
        // ignore resize
      }
    };
    window.addEventListener('resize', handleResize);

    // Command handling in standalone terminal
    let currentLine = '';
    term.onData((data) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

      if (data === '\r') {
        term.writeln('');
        const trimmed = currentLine.trim();
        if (trimmed === 'clear') {
          term.clear();
        } else if (trimmed === 'help' || trimmed === 'man lureguard') {
          term.writeln('\x1b[36mAvailable Commands:\x1b[0m');
          term.writeln('  help                  - Show this help menu');
          term.writeln('  clear                 - Clear terminal screen');
          term.writeln('  status                - Check pipeline status');
          term.writeln('  attack --ssh          - Trigger SSH Brute Force scenario');
          term.writeln('  attack --anomaly      - Trigger High-Velocity Anomaly scenario');
        } else if (trimmed === 'status') {
          term.writeln('\x1b[32m[✓] Pipeline Engine: ONLINE (<150ms Fast Path)\x1b[0m');
        } else if (trimmed.includes('ssh')) {
          handleTriggerScenario('ssh-bruteforce');
        } else if (trimmed.includes('anomaly')) {
          handleTriggerScenario('web-anomaly');
        } else if (trimmed) {
          term.writeln(`\x1b[31mbash: command not found: ${trimmed}. Type "help".\x1b[0m`);
        }
        currentLine = '';
        term.write('\x1b[32muser@lureguard-sandbox:~$ \x1b[0m');
      } else if (data === '\u007F') {
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        currentLine += data;
        term.write(data);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []);

  const handleTriggerScenario = (scenarioId: string) => {
    if (isSimulating || !xtermRef.current) return;
    setIsSimulating(true);

    if (onSelectScenario) {
      onSelectScenario(scenarioId);
    }

    const scenario = ATTACK_SCENARIOS.find((s) => s.id === scenarioId) || ATTACK_SCENARIOS[0];
    const term = xtermRef.current;

    term.writeln('\r\n');

    // Stream logs line by line based on delayMs
    scenario.terminalLogs.forEach((log, idx) => {
      setTimeout(() => {
        let linePrefix = '';
        if (log.type === 'prompt') linePrefix = '\x1b[32m';
        else if (log.type === 'info') linePrefix = '\x1b[36m';
        else if (log.type === 'warn') linePrefix = '\x1b[33m';
        else if (log.type === 'error') linePrefix = '\x1b[31m';
        else if (log.type === 'alert') linePrefix = '\x1b[1;31m';
        else if (log.type === 'success') linePrefix = '\x1b[32m';

        term.writeln(`${linePrefix}${log.text}\x1b[0m`);

        if (idx === scenario.terminalLogs.length - 1) {
          term.write('\r\n\x1b[32muser@lureguard-sandbox:~$ \x1b[0m');
          setIsSimulating(false);
        }
      }, log.delayMs);
    });
  };

  return (
    <div className="w-full space-y-3 text-left dir-ltr">
      {/* Preset Action Buttons Header Bar */}
      <div className="glass-panel p-3  border border-slate-800 bg-cyber-card/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-slate-400 font-bold mr-1">SCENARIO:</span>
          {ATTACK_SCENARIOS.map((sc) => {
            const isActive = activeScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                disabled={isSimulating}
                onClick={() => handleTriggerScenario(sc.id)}
                className={`px-3 py-1.5  font-mono text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.2)] glow-border-emerald'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                } disabled:opacity-50`}
              >
                <Play className={`w-3 h-3 ${isActive ? 'text-emerald-400 fill-emerald-400' : 'text-slate-400'}`} />
                <span>{sc.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => xtermRef.current?.clear()}
          className="p-1.5  bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
          title="Clear Terminal Output"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Embedded Terminal Container (macOS / Linux Window Top Bar) */}
      <div className="glass-panel  border border-slate-800/90 overflow-hidden shadow-[0_0_40px_rgba(8,11,16,0.9)] glow-border-emerald">
        {/* Top Header Bar */}
        <div className="bg-[#080B12] px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F43F5E] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#FBBF24] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#34D399] inline-block"></span>
            <span className="ml-3 font-mono text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              user@lureguard-sandbox:~
            </span>
          </div>

          <div className="font-mono text-[10px] text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
            SIMULATION REPLAY READY
          </div>
        </div>

        {/* XTerm Container Element */}
        <div className="p-2.5 bg-[#0B0F19] w-full relative">
          <div ref={terminalRef} className="w-full h-[400px]" />
        </div>
      </div>
    </div>
  );
};
