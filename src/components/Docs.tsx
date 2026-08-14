import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Zap,
  Shield,
  Bot,
  Terminal,
  Server,
  Database,
  Lock,
  Radio,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const SECTIONS = [
  { id: 'overview', title: 'System Overview & Philosophy', icon: BookOpen },
  { id: 'architecture', title: 'Architecture & Data Pipeline', icon: Layers },
  { id: 'ml-engine', title: 'ML Detection Engine & Features', icon: Cpu },
  { id: 'decision-engine', title: 'Decision Engine & Deception', icon: Shield },
  { id: 'byollm', title: 'BYOLLM & Prompt Security', icon: Bot },
  { id: 'api-operations', title: 'API & Administrative Operations', icon: Terminal },
];

export const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  return (
    <div dir="ltr" className="w-full min-h-screen bg-cyber-dark text-slate-200 font-sans flex flex-row items-start text-left relative z-10">
      {/* Left Sidebar Navigation (Always Pinned Left) */}
      <aside className="w-72 shrink-0 bg-slate-950/95 border-r border-slate-800/80 p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto z-20">
        <div className="flex items-center gap-2.5 mb-6 px-2">
          <div className="p-1.5  bg-blue-950/60 border border-blue-500/40 text-blue-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-mono text-xs font-bold text-white tracking-wider">man lureguard(8)</h2>
            <p className="text-[10px] font-mono text-slate-400">System Technical Manual</p>
          </div>
        </div>

        <nav className="space-y-1.5 font-mono text-xs">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5  transition-all text-left ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold shadow-[0_0_15px_rgba(59,130,246,0.2)] glow-border-blue'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="truncate">{sec.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Right Main Content Area (Spans Remaining Width) */}
      <main className="flex-1 min-w-0 p-6 md:p-10 max-w-5xl overflow-y-auto space-y-12">
        {/* Section 1: System Overview & Philosophy */}
        {(activeSection === 'overview' || activeSection === 'all') && (
          <section id="overview" className="glass-panel p-6 md:p-10  border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5  bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">[SECTION 01]</span>
                <h1 className="text-2xl md:text-3xl font-mono font-bold text-white">System Overview & Philosophy</h1>
              </div>
            </div>

            <p className="text-slate-300 text-base leading-relaxed">
              <strong>LureGuard.ai</strong> is an autonomous, open-source <strong>Host-Level SIEM</strong> built on top of <strong>Wazuh</strong>. It combines lightweight Machine Learning event classification, dynamic Honeypot deception routing, and BYOLLM (Bring Your Own LLM) AI threat summarization.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="glass-panel p-5  border border-slate-800/80 bg-cyber-card/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                  <Zap className="w-4 h-4" />
                  <span>1. LEAN ARCHITECTURE</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Zero heavy bloat. Built strictly with high-throughput custom engines: Classifier, Policy Engine, Dynamic Router, DNAT Enforcer, and LLM Abstraction Layer.
                </p>
              </div>

              <div className="glass-panel p-5  border border-slate-800/80 bg-cyber-card/40 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                  <Server className="w-4 h-4" />
                  <span>2. PROTOCOL SCOPE</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Demonstrates SSH protocol as a reference implementation (<code className="text-cyan-300 font-mono">auth.log</code>, <code className="text-cyan-300 font-mono">cowrie.json</code>) while remaining protocol-agnostic for HTTP, FTP, and DB traps.
                </p>
              </div>

              <div className="glass-panel p-5  border border-slate-800/80 bg-cyber-card/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
                  <Lock className="w-4 h-4" />
                  <span>3. CHANNEL ISOLATION</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Honeypot channel events are strictly <strong>IGNORED</strong> for decision-making because traffic hitting the honeypot is already contained and neutralized.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Section 2: Architecture & Data Pipeline */}
        {(activeSection === 'architecture' || activeSection === 'all') && (
          <section id="architecture" className="glass-panel p-6 md:p-10  border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5  bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">[SECTION 02]</span>
                <h2 className="text-2xl md:text-3xl font-mono font-bold text-white">Architecture & Data Pipeline</h2>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm font-bold text-white">Visual Pipeline Flow</h3>
              <div className="bg-slate-950/90 p-4  border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto scanline-bg">
                SSH Event ➔ Wazuh Agent ➔ integratord ➔ LureGuard Core Ingestion ➔ ML Inference ➔ Policy Decision ➔ iptables DNAT / Telegram Alert
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h4 className="font-mono text-xs font-bold text-cyan-400 uppercase">Core Components</h4>
                <ul className="space-y-2 text-xs font-mono text-slate-300">
                  <li className="flex items-start gap-2 bg-slate-900/60 p-3  border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-bold">Wazuh Agent & Manager:</span> Collects auth.log, syslog, cowrie.json, FIM, and rootcheck.
                    </div>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-900/60 p-3  border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-bold">LureGuard Core (FastAPI / Python 3.14):</span> Single-process monolith eliminating inter-service HTTP overhead.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-mono text-xs font-bold text-cyan-400 uppercase">Persistence & Containers</h4>
                <ul className="space-y-2 text-xs font-mono text-slate-300">
                  <li className="flex items-start gap-2 bg-slate-900/60 p-3  border border-slate-800">
                    <Database className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-bold">PostgreSQL 16:</span> Primary DB storing raw events, ML decisions, sessions, and LLM summaries.
                    </div>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-900/60 p-3  border border-slate-800">
                    <Radio className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-bold">Cowrie Profiles:</span> Isolated Docker traps (dev-server on port 2222, db-server on port 2223).
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Section 3: ML Detection Engine & Feature Vector */}
        {(activeSection === 'ml-engine' || activeSection === 'all') && (
          <section id="ml-engine" className="glass-panel p-6 md:p-10  border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5  bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">[SECTION 03]</span>
                <h2 className="text-2xl md:text-3xl font-mono font-bold text-white">ML Detection Engine & Features</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-white">Sliding Window Feature Vector (W = 300s, step = 10s)</h3>
                <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
                  8 Extracted Features
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80">
                      <th className="p-3">Feature ID</th>
                      <th className="p-3">Feature Name</th>
                      <th className="p-3">Description & Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="p-3 font-bold text-amber-400">f1</td>
                      <td className="p-3 text-white">attempts</td>
                      <td className="p-3 text-slate-400">Total connection & auth attempts in window W</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-400">f2</td>
                      <td className="p-3 text-white">failed_ratio</td>
                      <td className="p-3 text-slate-400">Ratio of failed authentications (0.0 to 1.0)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-400">f3</td>
                      <td className="p-3 text-white">distinct_user</td>
                      <td className="p-3 text-slate-400">Count of unique usernames attempted (dictionary attack detection)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-400">f4</td>
                      <td className="p-3 text-white">burst_max</td>
                      <td className="p-3 text-slate-400">Maximum connection burst frequency within 10s sub-window</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-400">f5</td>
                      <td className="p-3 text-white">mean_inter_ms</td>
                      <td className="p-3 text-slate-400">Mean inter-arrival time between requests (milliseconds)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-400">f6</td>
                      <td className="p-3 text-white">stddev_inter_ms</td>
                      <td className="p-3 text-slate-400">Standard deviation of inter-arrival timing (bot vs human detection)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-400">f7</td>
                      <td className="p-3 text-white">hour_weight</td>
                      <td className="p-3 text-slate-400">Time-of-day weight penalty for off-hour access spikes</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-400">f8</td>
                      <td className="p-3 text-white">is_known_good</td>
                      <td className="p-3 text-slate-400">Boolean binary flag indicating whitelisted source IP</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-panel p-4  border border-amber-500/30 bg-amber-950/10 text-xs font-mono text-amber-300 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">Whitelist Optimization (Fail-Safe):</span>
                If <code className="text-white">f8 = 1</code> (whitelisted IP), the engine skips ML inference completely and forces threat probability <code class="text-white">p = 0</code> immediately.
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Decision Engine & Dynamic Deception */}
        {(activeSection === 'decision-engine' || activeSection === 'all') && (
          <section id="decision-engine" className="glass-panel p-6 md:p-10  border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5  bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-rose-400 uppercase tracking-widest">[SECTION 04]</span>
                <h2 className="text-2xl md:text-3xl font-mono font-bold text-white">Decision Engine & Profile Selector</h2>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm font-bold text-white">Two-Threshold Policy Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-slate-900/80 p-4  border border-emerald-500/40 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">ALLOW</span>
                  <div className="text-slate-300 font-bold">Score S &le; T1 (0.55)</div>
                  <p className="text-slate-400 text-[11px]">Normal legitimate traffic. Passed through without network enforcement.</p>
                </div>

                <div className="bg-slate-900/80 p-4  border border-amber-500/40 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">ALERT</span>
                  <div className="text-slate-300 font-bold">T1 &lt; Score S &le; T2 (0.70)</div>
                  <p className="text-slate-400 text-[11px]">Suspicious activity. Dispatches instant Telegram notification without blocking.</p>
                </div>

                <div className="bg-slate-900/80 p-4  border border-rose-500/40 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">REDIRECT</span>
                  <div className="text-slate-300 font-bold">Score S &gt; T2 (0.70)</div>
                  <p className="text-slate-400 text-[11px]">Active attack. Applies iptables DNAT redirect to honeypot & sends TCP RST.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-mono text-sm font-bold text-white">Dynamic Honeypot Profile Selector Logic</h3>
              <div className="bg-slate-950 p-4  border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-cyan-400 font-bold">// Pure Function Profile Routing</div>
                <div><span className="text-amber-400">DB-oriented usernames</span> (postgres, mysql, redis, mongo) ➔ <span className="text-white font-bold">db-server (port 2223)</span></div>
                <div><span className="text-emerald-400">Dev/System usernames</span> (deploy, git, docker, ubuntu, app) ➔ <span className="text-white font-bold">dev-server (port 2222)</span></div>
                <div><span className="text-rose-400">Fallback rule</span> (if threat score p &ge; 0.85) ➔ <span className="text-white font-bold">db-server</span>, else <span className="text-white font-bold">dev-server</span></div>
              </div>
            </div>
          </section>
        )}

        {/* Section 5: BYOLLM Summarization & Security */}
        {(activeSection === 'byollm' || activeSection === 'all') && (
          <section id="byollm" className="glass-panel p-6 md:p-10  border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5  bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">[SECTION 05]</span>
                <h2 className="text-2xl md:text-3xl font-mono font-bold text-white">BYOLLM & Prompt Security</h2>
              </div>
            </div>

            <p className="text-slate-300 text-base leading-relaxed">
              <strong>Bring Your Own LLM (BYOLLM)</strong> allows SOC teams to plug in local or cloud AI models to generate executive summaries and incident investigation reports.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-5  border border-slate-800/80 bg-cyber-card/40 space-y-3">
                <h4 className="font-mono text-xs font-bold text-emerald-400 uppercase">Supported Providers</h4>
                <ul className="space-y-1.5 font-mono text-xs text-slate-300">
                  <li>• <span className="text-white font-bold">Ollama:</span> Local Llama 3 8B / DeepSeek R1</li>
                  <li>• <span className="text-white font-bold">OpenAI API:</span> GPT-4o-mini</li>
                  <li>• <span className="text-white font-bold">Anthropic API:</span> Claude 3.5 Haiku</li>
                  <li>• <span className="text-white font-bold">OpenAI-Compatible:</span> Groq / OpenRouter</li>
                </ul>
              </div>

              <div className="glass-panel p-5  border border-rose-500/30 bg-rose-950/10 space-y-3">
                <h4 className="font-mono text-xs font-bold text-rose-400 uppercase">Critical Security Rule</h4>
                <p className="text-slate-300 text-xs leading-relaxed font-mono">
                  LLM outputs are strictly <strong>EVIDENCE CONSUMERS</strong> and NEVER influence network policy or security decision-making.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold text-cyan-400 uppercase">Prompt Injection Defense</h4>
              <div className="bg-slate-950 p-4  border border-slate-800 font-mono text-xs text-slate-300">
                Attacker input is sanitized & wrapped in strict boundaries:
                <div className="text-cyan-300 mt-2 p-2 bg-slate-900 rounded border border-slate-800">
                  &lt;&lt;&lt;ATTACKER_INPUT&gt;&gt;&gt;<br />
                  [Raw sanitized auth.log payload]<br />
                  &lt;&lt;&lt;END&gt;&gt;&gt;
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 6: API, Admin & Operations */}
        {(activeSection === 'api-operations' || activeSection === 'all') && (
          <section id="api-operations" className="glass-panel p-6 md:p-10  border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5  bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">[SECTION 06]</span>
                <h2 className="text-2xl md:text-3xl font-mono font-bold text-white">API & Administrative Operations</h2>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm font-bold text-white">Wazuh Ingestion Endpoint</h3>
              <div className="bg-slate-950 p-4  border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                <div className="text-emerald-400 font-bold">POST /wazuh/event</div>
                <div className="text-slate-400">Header: <code className="text-cyan-300">X-LureGuard-Token: &lt;SECRET_TOKEN&gt;</code></div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm font-bold text-white">Admin API Endpoints (Bearer Token Required)</h3>
              <div className="space-y-2 font-mono text-xs">
                <div className="bg-slate-900/80 p-3  border border-slate-800 flex items-center justify-between">
                  <span className="text-amber-400 font-bold">GET / PUT /config/thresholds</span>
                  <span className="text-slate-400">Dynamic runtime T1 / T2 calibration</span>
                </div>
                <div className="bg-slate-900/80 p-3  border border-slate-800 flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">GET / POST / DELETE /whitelist</span>
                  <span className="text-slate-400">IP whitelist management (f8 override)</span>
                </div>
                <div className="bg-slate-900/80 p-3  border border-rose-500/40 flex items-center justify-between">
                  <span className="text-rose-400 font-bold">POST /panic-flush</span>
                  <span className="text-slate-400">Instant emergency flush of iptables rules</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5  border border-slate-800 bg-cyber-card/40 space-y-2">
              <h4 className="font-mono text-xs font-bold text-white uppercase">Observability & Monitoring</h4>
              <p className="text-slate-400 text-xs font-mono">
                Integrated Grafana 6-dashboard suite + Prometheus metrics endpoint at <code className="text-emerald-400">/metrics</code>.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
