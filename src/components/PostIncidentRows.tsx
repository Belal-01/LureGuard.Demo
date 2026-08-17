import React, { useEffect, useState } from 'react';
import { FileText, Download, Send } from 'lucide-react';

/* ============================================================
   Phase state machine — queued → active → done, looping.
   Drives both rows below off the same clock shape so they read
   as one coherent "pipeline" rather than two unrelated widgets.
   ============================================================ */

type Phase = 'queued' | 'active' | 'done';

function useAutoPhase(active: boolean, activeMs: number, doneMs = 0, loop = false) {
  const [phase, setPhase] = useState<Phase>('queued');
  useEffect(() => {
    if (!active) {
      setPhase('queued');
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setPhase('queued');
      timers.push(setTimeout(() => !cancelled && setPhase('active'), 300));
      timers.push(setTimeout(() => !cancelled && setPhase('done'), 300 + activeMs));
      if (loop && doneMs > 0) {
        timers.push(setTimeout(() => !cancelled && run(), 300 + activeMs + doneMs));
      }
    };
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [active, activeMs, doneMs, loop]);
  return phase;
}

/* ============================================================
   Row 1 — AI Incident Report: a real filling progress bar while
   "writing" the PDF, then swaps to a Report Ready state.
   Runs exactly ONCE when active.
   ============================================================ */

export function ReportGenerationRow({
  active = true,
  onPhaseChange,
}: {
  active?: boolean;
  onPhaseChange?: (phase: Phase) => void;
}) {
  const phase = useAutoPhase(active, 2200, 0, false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  useEffect(() => {
    if (phase !== 'active') {
      setProgress(phase === 'done' ? 100 : 0);
      return;
    }
    setProgress(0);
    const id = setInterval(() => setProgress((p) => Math.min(100, p + 8)), 160);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div className="py-3.5 flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/70">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="text-slate-900 dark:text-slate-100 font-medium text-sm block">AI Incident Report</span>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-xs block mt-0.5">
            {phase === 'queued' && 'Waiting for containment to finish'}
            {phase === 'active' && `Compiling forensic summary… ${progress}%`}
            {phase === 'done' && 'report-9C347A.pdf · 214 KB'}
          </span>
          {phase === 'active' && (
            <div className="mt-1.5 h-1 w-32 rounded-full bg-indigo-100 dark:bg-indigo-950/80 overflow-hidden">
              <div
                className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-150 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <span
        className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 border transition-colors ${
          phase === 'done'
            ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
            : phase === 'active'
            ? 'border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500'
        }`}
      >
        {phase === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />}
        {phase === 'done' && <Download className="w-3 h-3" />}
        {phase === 'queued' ? 'QUEUED' : phase === 'active' ? 'GENERATING' : 'REPORT READY'}
      </span>
    </div>
  );
}

/* ============================================================
   Row 2 — Telegram Alert Dispatch: the send icon "flies off",
   then a Telegram-style double check-mark confirms delivery.
   Only triggers AFTER the PDF report generation completes (phase === 'done').
   Runs exactly ONCE.
   ============================================================ */

export function TelegramDispatchRow({
  active = true,
  reportPhase,
}: {
  active?: boolean;
  reportPhase?: Phase;
}) {
  const isTriggered = reportPhase ? reportPhase === 'done' : active;
  const phase = useAutoPhase(active && isTriggered, 1600, 0, false);

  return (
    <div className="py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-800/50 text-sky-600 dark:text-sky-400 flex-shrink-0 overflow-hidden">
          <Send
            className={`w-4 h-4 transition-all duration-700 ease-out ${
              phase === 'active' ? 'translate-x-3 -translate-y-2 opacity-0' : 'translate-x-0 translate-y-0 opacity-100'
            }`}
          />
        </div>
        <div className="min-w-0">
          <span className="text-slate-900 dark:text-slate-100 font-medium text-sm block">Telegram SOC Alert</span>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-xs block mt-0.5">
            {phase === 'queued' && 'Waiting for PDF report generation…'}
            {phase === 'active' && 'Dispatching alert to @LureGuardAlertBot…'}
            {phase === 'done' && '@LureGuardAlertBot · Sent'}
          </span>
        </div>
      </div>

      <span
        className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 border transition-colors ${
          phase === 'done'
            ? 'border-sky-200 dark:border-sky-800/60 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
            : phase === 'active'
            ? 'border-sky-200 dark:border-sky-800/60 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500'
        }`}
      >
        {phase === 'queued' && 'QUEUED'}
        {phase === 'active' && (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse" />
            SENDING…
          </>
        )}
        {phase === 'done' && (
          <>
            <span className="text-sky-500 dark:text-sky-400 tracking-tighter">✓✓</span> DELIVERED
          </>
        )}
      </span>
    </div>
  );
}

/* ============================================================
   Combined Container — coordinates the step-by-step pipeline
   so Telegram dispatch animation only runs after PDF is ready.
   ============================================================ */

export function PostIncidentRows({ active = true }: { active?: boolean }) {
  const [reportPhase, setReportPhase] = useState<Phase>('queued');

  return (
    <>
      <ReportGenerationRow active={active} onPhaseChange={setReportPhase} />
      <TelegramDispatchRow active={active} reportPhase={reportPhase} />
    </>
  );
}

/* ============================================================
   Demo wrapper — mirrors existing light card
   ============================================================ */

export default function PostIncidentPreview({ active = true }: { active?: boolean }) {
  return (
    <div className="max-w-md rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-mono tracking-wider text-gray-400 uppercase">
          Automated Containment &amp; Report
        </span>
        <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          CONTAINED &amp; LOGGED
        </span>
      </div>
      <h3 className="text-gray-900 font-semibold text-base mb-4">Containment &amp; Forensic Remediation</h3>

      <PostIncidentRows active={active} />
    </div>
  );
}
