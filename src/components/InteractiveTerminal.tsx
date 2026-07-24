import React, { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Play, Flame, ShieldAlert, Cpu, CornerDownLeft, Trash2 } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'prompt' | 'info' | 'success' | 'warn' | 'error' | 'alert';
  text: string;
}

interface InteractiveTerminalProps {
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

const PRESET_SCENARIOS = [
  {
    label: 'Run SSH Brute Force',
    icon: Flame,
    color: 'rose',
    command: 'python3 attack_sim.py --type ssh_bruteforce --target 192.168.1.105',
    scenarioData: {
      name: 'SSH Brute-Force (Cowrie Trap)',
      threatScore: 94,
      reqPerSec: 480,
      ip: '185.220.101.5',
      location: 'Frankfurt, Germany',
      isTor: true,
      ruleId: 5710,
    },
    logs: [
      { type: 'info', text: '[+] Initializing SSH Brute Force scenario...' },
      { type: 'warn', text: '[!] Target IP: 192.168.1.105:2222 (Cowrie Honeypot)' },
      { type: 'info', text: '[*] Injecting dictionary payload (user: root, pass: admin123...)' },
      { type: 'error', text: '[!] INBOUND_CONN: 185.220.101.5 (TOR Exit Node Detected)' },
      { type: 'info', text: '[*] Pipeline Extracted f1-f8 features in 12ms' },
      { type: 'alert', text: '[✓] ML Classifier Score: 94/100 -> Threat Confirmed!' },
      { type: 'success', text: '[✓] FAST PATH: Attacker session isolated & redirected to honeypot.' },
    ],
  },
  {
    label: 'Simulate Anomaly',
    icon: Cpu,
    color: 'amber',
    command: './attack_sim.sh --anomaly-detection --rate 500req/s',
    scenarioData: {
      name: 'High-Velocity Anomaly Probe',
      threatScore: 88,
      reqPerSec: 520,
      ip: '45.33.32.156',
      location: 'Dallas, United States',
      isTor: false,
      ruleId: 31101,
    },
    logs: [
      { type: 'info', text: '[+] Spawning multi-threaded HTTP burst generator...' },
      { type: 'warn', text: '[!] Request rate spiked: 520 req/sec on endpoint /api/v1/auth' },
      { type: 'info', text: '[*] Calculating entropy and velocity metrics...' },
      { type: 'alert', text: '[✓] ML Classifier Score: 88/100 -> Anomaly Triggered!' },
      { type: 'success', text: '[✓] DEEP PATH: LLM triage agent dispatched to assemble report.' },
    ],
  },
  {
    label: 'Trigger Policy Violation',
    icon: ShieldAlert,
    color: 'cyan',
    command: 'curl -X POST http://localhost:8000/api/v1/alert --data \'{"rule_id": 5710, "level": 12}\'',
    scenarioData: {
      name: 'Direct Policy Violation Alert',
      threatScore: 98,
      reqPerSec: 120,
      ip: '198.51.100.42',
      location: 'Amsterdam, Netherlands',
      isTor: true,
      ruleId: 100200,
    },
    logs: [
      { type: 'info', text: '[+] Sending mock Wazuh JSON alert directly to Collector API...' },
      { type: 'info', text: '[*] Payload: {"rule_id": 100200, "level": 12, "src_ip": "198.51.100.42"}' },
      { type: 'alert', text: '[✓] Collector API response: 200 OK (Processed in 8ms)' },
      { type: 'success', text: '[✓] Immediate Telegram notification dispatched to SOC Telegram Group.' },
    ],
  },
];

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({ onAttackTriggered }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'info', text: 'LureGuard Interactive Bash Sandbox [v1.0.0-SOC]' },
    { id: '2', type: 'info', text: 'Type "help" or click a preset scenario above to simulate attacks.' },
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLine = (type: TerminalLine['type'], text: string) => {
    setLines((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), type, text },
    ]);
  };

  const executeScenario = (preset: typeof PRESET_SCENARIOS[0]) => {
    if (isExecuting) return;
    setIsExecuting(true);

    // Print command prompt
    addLine('prompt', `user@lureguard-sandbox:~$ ${preset.command}`);

    // Stream log lines one by one
    preset.logs.forEach((log, index) => {
      setTimeout(() => {
        addLine(log.type as any, log.text);
        if (index === preset.logs.length - 1) {
          setIsExecuting(false);
          if (onAttackTriggered) {
            onAttackTriggered(preset.scenarioData);
          }
        }
      }, (index + 1) * 450);
    });
  };

  const handleManualCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd || isExecuting) return;

    setInputVal('');
    addLine('prompt', `user@lureguard-sandbox:~$ ${cmd}`);

    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      setLines([]);
      return;
    }

    if (lower === 'help' || lower === 'man lureguard') {
      addLine('info', 'Available Commands:');
      addLine('info', '  help                  - Displays this help menu');
      addLine('info', '  clear                 - Clears terminal output');
      addLine('info', '  status                - Checks pipeline health & ML Fast Path status');
      addLine('info', '  attack --ssh          - Triggers SSH Brute Force scenario');
      addLine('info', '  attack --anomaly      - Triggers High-Velocity Anomaly scenario');
      addLine('info', '  curl -X POST ...      - Sends mock JSON payload to Collector API');
      return;
    }

    if (lower === 'status' || lower === 'lureguard-cli status') {
      addLine('success', '[✓] Pipeline Engine: ONLINE (<150ms Fast Path ready)');
      addLine('success', '[✓] Wazuh Integration: ACTIVE (Listening on port 1514/udp)');
      addLine('success', '[✓] LLM Triage Worker: READY (Ollama / DeepSeek model loaded)');
      return;
    }

    if (lower.includes('ssh') || lower.includes('hydra')) {
      executeScenario(PRESET_SCENARIOS[0]);
      return;
    }

    if (lower.includes('anomaly')) {
      executeScenario(PRESET_SCENARIOS[1]);
      return;
    }

    if (lower.includes('curl') || lower.includes('post') || lower.includes('alert')) {
      executeScenario(PRESET_SCENARIOS[2]);
      return;
    }

    // Default unrecognized command
    addLine('error', `bash: command not found: ${cmd}. Type "help" for available commands.`);
  };

  return (
    <div className="w-full space-y-6 text-left dir-ltr">
      {/* Mode A: Preset Quick Action Buttons */}
      <div className="flex flex-wrap gap-2.5 items-center min-h-[40px]">
        <span className="font-mono text-xs text-slate-400 font-semibold mr-1">Attack Scenarios:</span>
        {PRESET_SCENARIOS.map((scenario, idx) => {
          const Icon = scenario.icon;
          return (
            <button
              key={idx}
              disabled={isExecuting}
              onClick={() => executeScenario(scenario)}
              className="px-3 py-2 rounded-lg font-mono text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-400/50 hover:shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Icon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{scenario.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setLines([])}
          className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors ml-auto"
          title="Clear Terminal"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Terminal Window */}
      <div className="glass-panel rounded-2xl border border-slate-800/90 overflow-hidden shadow-[0_0_50px_rgba(8,11,16,0.9)] glow-border-cyan">
        {/* Top Window Bar (Linux/macOS style) */}
        <div className="bg-slate-950/90 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="ml-3 font-mono text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
              user@lureguard-sandbox: ~
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">Bash v5.2</span>
        </div>

        {/* Output Stream Area */}
        <div className="p-4 bg-cyber-panel/95 font-mono text-xs sm:text-sm h-[380px] overflow-y-auto space-y-2 scanline-bg select-text">
          {lines.map((line) => {
            if (line.type === 'prompt') {
              return (
                <div key={line.id} className="text-emerald-400 font-semibold pt-1">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'success') {
              return (
                <div key={line.id} className="text-emerald-400 glow-text-emerald">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'warn') {
              return <div key={line.id} className="text-amber-400">{line.text}</div>;
            }
            if (line.type === 'error') {
              return <div key={line.id} className="text-rose-400 font-semibold">{line.text}</div>;
            }
            if (line.type === 'alert') {
              return (
                <div key={line.id} className="text-rose-400 font-bold bg-rose-950/40 p-1.5 rounded border border-rose-500/30 glow-text-rose">
                  {line.text}
                </div>
              );
            }
            return <div key={line.id} className="text-cyan-300">{line.text}</div>;
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Input Prompt Form */}
        <form onSubmit={handleManualCommand} className="bg-slate-950/95 px-4 py-2.5 border-t border-slate-800/80 flex items-center gap-2">
          <span className="font-mono text-xs text-emerald-400 font-bold shrink-0">user@lureguard-sandbox:~$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isExecuting}
            placeholder={isExecuting ? 'Simulation in progress...' : 'Type command (e.g. help, status, ssh)...'}
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-600 font-mono text-xs sm:text-sm focus:outline-none"
          />
          <button type="submit" disabled={isExecuting || !inputVal.trim()} className="text-emerald-400 hover:text-emerald-300 disabled:opacity-30">
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
