import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FaqItem {
  id: string;
  number: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    number: '01',
    question: 'Will LureGuard affect app performance?',
    answer:
      'No. LureGuard is optimized to run efficiently in the background with no impact on performance and user experience, executing ML threat triage in under 150ms.',
  },
  {
    id: 'faq-2',
    number: '02',
    question: 'Does LureGuard require access to my source code?',
    answer:
      'No. LureGuard operates at the network, syslog, and container container isolation layers without needing any access to your application source code.',
  },
  {
    id: 'faq-3',
    number: '03',
    question: 'Do I need to change my source code to use LureGuard?',
    answer:
      'No. LureGuard integrates seamlessly into existing infrastructure via standard iptables DNAT traffic redirection and Wazuh log collection agents.',
  },
  {
    id: 'faq-4',
    number: '04',
    question: 'What types of threats does LureGuard defend against?',
    answer:
      'LureGuard defends against automated SSH brute-forcing, zero-day exploit probing, web API scraping, SQL injection, and lateral attacker movement.',
  },
  {
    id: 'faq-5',
    number: '05',
    question: 'Which platforms does LureGuard support?',
    answer:
      'LureGuard supports AWS, Azure, GCP, bare-metal Linux servers (Ubuntu, Debian, RHEL), Docker containers, and Kubernetes clusters.',
  },
  {
    id: 'faq-6',
    number: '06',
    question: 'Does LureGuard support cross-platform apps?',
    answer:
      'Yes. Since LureGuard operates on network deception traps and API gateway entry points, it protects all cross-platform web, mobile, and backend microservices.',
  },
  {
    id: 'faq-7',
    number: '07',
    question: 'Can LureGuard protect AI models and business logic inside apps?',
    answer:
      'Yes. LureGuard deploys deceptive AI honeypots and synthetic data endpoints to trap adversarial prompt injections and bot scrapers before they touch your live models.',
  },
  {
    id: 'faq-8',
    number: '08',
    question: 'Does LureGuard support on-premises deployment?',
    answer:
      'Yes. LureGuard supports full on-premises and air-gapped deployments with local log indexers to maintain strict data privacy compliance.',
  },
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="max-w-7xl w-full mx-auto px-4 py-16 md:py-24 text-left dir-ltr relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Heading & Subtitle */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
            <span className="text-slate-400 dark:text-slate-500">—</span>
            <span>FAQS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
            The questions security teams actually ask us.
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-sans leading-relaxed">
            Pulled from the real conversations that happen before a team adopts LureGuard.
          </p>
        </div>

        {/* Right Column: Accordion List */}
        <div className="lg:col-span-7 divide-y divide-slate-200 dark:divide-slate-800/80 border-t border-b border-slate-200 dark:border-slate-800/80">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="py-5 sm:py-6 transition-colors group">
                <button
                  onClick={() => toggleFaq(item.id)}
                  type="button"
                  className="w-full flex items-start justify-between gap-4 text-left cursor-pointer select-none focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4 sm:gap-6 pr-2">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500 pt-1 shrink-0">
                      {item.number}
                    </span>
                    <h3
                      className={`text-base sm:text-lg md:text-xl font-mono font-bold transition-colors ${
                        isOpen
                          ? 'text-cyan-600 dark:text-cyan-400'
                          : 'text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400'
                      }`}
                    >
                      {item.question}
                    </h3>
                  </div>

                  {/* Circle Toggle Button */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)]'
                        : 'bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 group-hover:border-slate-400 dark:group-hover:border-slate-700'
                    }`}
                  >
                    {isOpen ? (
                      <X className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                </button>

                {/* Expanded Answer */}
                {isOpen && (
                  <div className="pl-8 sm:pl-12 pr-10 pt-4 text-slate-600 dark:text-slate-300 font-sans text-sm sm:text-base leading-relaxed animate-fadeIn">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
