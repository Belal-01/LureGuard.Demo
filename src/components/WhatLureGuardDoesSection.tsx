import React, { useEffect, useState } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThreatIntelligenceCard } from './ThreatIntelligenceCard';
import { SectionHeader } from './SectionHeader';

interface TabData {
  id: string;
  tabLabel: string;
  title: string;
  description: string;
  highlights: string[];
  cardHeader: string;
  cardBadge: string;
}

const TABS: TabData[] = [
  {
    id: 'prep',
    tabLabel: ' PREPARATION',
    title: 'Deception Traps & Agent Readiness',
    description:
      'Deploy isolated honeypot profiles and configure Wazuh endpoint agents to monitor system logs before any attacker strikes.',
    highlights: [
      'Deploy isolated Dev & DB Honeypot Traps in seconds',
      'Wazuh Agent & Syslog Multi-Channel Log Ingestion',
      'Fail-Safe IP Whitelisting Bypass Rules out of the box',
    ],
    cardHeader: 'TRAP PREPARATION & READINESS',
    cardBadge: '2 TRAPS READY',
  },
  {
    id: 'detect',
    tabLabel: ' DETECTION AND ANALYSIS',
    title: 'Sub-150ms ML Threat Classification',
    description:
      'Extract real-time feature metrics across sliding windows to calculate precise threat probabilities in under 150ms.',
    highlights: [
      'Sliding-Window Feature Vector Extraction (f1–f8 Metrics)',
      'Fast Path ML Classifier & Real-Time Entropy Scoring',
      'GeoIP Telemetry & TOR Exit Node Detection',
    ],
    cardHeader: 'LIVE ATTACK FEED & ML TRIAGE',
    cardBadge: 'BLOCKING ACTIVE',
  },
  {
    id: 'post',
    tabLabel: 'POST INCIDENT ACTIVITY',
    title: 'Automated Containment & LLM Summaries',
    description:
      'Enforce pre-connection iptables DNAT redirects to honeypots, dispatch instant Telegram SOC alerts, and generate AI reports.',
    highlights: [
      'Pre-Connection iptables DNAT Traffic Redirection',
      'Instant High-Priority Telegram Alert Dispatches (@LureGuardAlertBot)',
      'BYOLLM Automated Executive Incident Summary Reports',
    ],
    cardHeader: 'AUTOMATED CONTAINMENT & REPORT',
    cardBadge: 'CONTAINED & LOGGED',
  },
];

export const WhatLureGuardDoesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-Rotating Progress Bar Timer (7 Seconds per tab)
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 40; // Update every 40ms
    const totalDuration = 7000; // 7 seconds (increased by 2s)
    const stepIncrement = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveTab((current) => (current + 1) % TABS.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, activeTab]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setProgress(0);
  };

  const currentTab = TABS[activeTab];

  return (
    <section className="w-full px-6 sm:px-8 py-12 md:py-20 text-left dir-ltr relative z-10 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
      {/* Main Section Header with Entrance Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <SectionHeader
          tag="UNDER THE HOOD"
          title="What Does LureGuard Do?"
          subtitle="Autonomous Threat Prevention & Incident Response Lifecycle Built for Zero-Trust Infrastructure."
          align="center"
        />
      </motion.div>

      {/* Horizontal Tabs Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative mb-12"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-none font-mono text-xs">
          {TABS.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleTabClick(idx)}
                className={`relative px-4 py-2.5  border transition-all duration-300 shrink-0 flex items-center gap-2 text-xs font-mono font-semibold tracking-wider cursor-pointer ${
                  isActive
                    ? 'border-cyan-500/50 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-950 dark:text-white '
                    : 'border-slate-200 dark:border-slate-800/90 bg-slate-100/70 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400  animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                )}
                <span>{tab.tabLabel}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Full-width track line with single progress bar resetting to 0% for each tab */}
        <div className="relative w-full h-[1px] bg-slate-200 dark:bg-slate-800/80 mt-1">
          <div
            className="h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500  transition-all duration-75 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>

      {/* Dynamic 2-Column Content Grid with Tab Transition Animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Left Column: Title, Subtitle, Checklist & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
              {currentTab.title}
            </h3>

            <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed font-sans max-w-xl">
              {currentTab.description}
            </p>

            {/* Checklist Bullet Points with Circular Checkmark Badges */}
            <ul className="space-y-4 pt-2">
              {currentTab.highlights.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 dark:border-cyan-500/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-slate-900 dark:text-white font-sans text-sm md:text-base font-semibold">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Bottom Action CTA Button */}
            <div className="pt-4">
              <a
                href="#install"
                className="inline-flex items-center gap-2 px-6 py-3  font-sans text-sm font-bold bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 transition-all duration-300 group  transform hover:-translate-y-0.5"
              >
                <span>Get started</span>
                <ArrowUpRight className="w-4 h-4 text-white dark:text-slate-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 stroke-[2.5]" />
              </a>
            </div>
          </div>

          {/* Right Column: Sleek High-Tech Product Card */}
          <div className="lg:col-span-6 w-full">
            <ThreatIntelligenceCard
              activeTab={activeTab}
              cardHeader={currentTab.cardHeader}
              cardBadge={currentTab.cardBadge}
              glowColor="#06b6d4"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
