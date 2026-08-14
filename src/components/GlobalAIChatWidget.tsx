import React, { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Sparkles, ChevronRight, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

const KNOWLEDGE_BASE = {
  architecture: `🛡️ **LureGuard.ai System Architecture**\n\nOur autonomous pipeline operates in 7 sequential stages:\n\n1. **Attacker:** SSH brute-force or anomaly hits the host.\n2. **Wazuh Agent:** Captures raw endpoint logs in real time.\n3. **Wazuh Manager:** Correlates events and triggers structured alerts.\n4. **Collector API:** Pulls alerts & extracts features (f1–f8).\n5. **AI Classifier:** Evaluates threat probability (<150ms Fast Path).\n6. **Core + Postgres:** Stores findings, posture data, and event history.\n7. **Grafana / TG:** Updates live SOC dashboards & dispatches instant Telegram alerts!`,

  sandbox: `🎮 **LureGuard Sandbox Guide**\n\nYou can test our interactive playground at \`/sandbox\`:\n\n• **Attack Terminal:** Execute 1-click simulation scenarios (SSH Brute Force, Port Scan, Payload Injection).\n• **Defense Panel:** Watch the real-time Threat Score Meter (e.g., 94/100 HIGH), attack velocity (req/sec), GeoIP lookup, and live Telegram notification preview!`,

  deployment: `🚀 **Deployment & Installation Instructions**\n\nTo run LureGuard.ai in your environment:\n\n1. **Clone repository & prepare environment:**\n   \`\`\`bash\n   cp .env.example .env\n   \`\`\`\n2. **Configure Gateways:** Ensure direct gateway IP (\`172.19.0.1\`) is excluded in whitelist.\n3. **Spin up Docker Services:**\n   \`\`\`bash\n   docker compose up -d --build\n   \`\`\`\n4. Verify backend status with \`curl http://localhost:8000/health\`.`,

  default: `I'm your **LureGuard.ai SOC Assistant**! 🤖\nI can help you explore our 7-stage architecture, how to execute simulations in the Sandbox, or deploy LureGuard via Docker. Feel free to ask any question!`,
};

export const GlobalAIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I'm the **LureGuard.ai SOC Assistant**. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        'How does the 7-stage pipeline work?',
        'How do I run the attack sandbox?',
        'How do I deploy LureGuard with Docker?',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // AI Response Logic
    setTimeout(() => {
      const lower = query.toLowerCase();
      let botResponse = KNOWLEDGE_BASE.default;

      if (lower.includes('architecture') || lower.includes('pipeline') || lower.includes('stage') || lower.includes('7') || lower.includes('wazuh')) {
        botResponse = KNOWLEDGE_BASE.architecture;
      } else if (lower.includes('sandbox') || lower.includes('attack') || lower.includes('simul') || lower.includes('test')) {
        botResponse = KNOWLEDGE_BASE.sandbox;
      } else if (lower.includes('deploy') || lower.includes('docker') || lower.includes('install') || lower.includes('run')) {
        botResponse = KNOWLEDGE_BASE.deployment;
      }

      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Left Corner) */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="group relative inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900/90 text-blue-400 border border-blue-500/40 hover:border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] transition-all duration-300 font-mono text-xs font-semibold backdrop-blur-md"
          aria-label="Toggle AI Chat Widget"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-400"></span>
          </span>
          <Bot className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
          <span>Ask Me About LureGuard.ai 🤖</span>
        </button>
      </div>

      {/* Fly-out Chat Modal Container (Anchored Bottom-Left) */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-80 sm:w-96 glass-panel  border border-blue-500/30 shadow-[0_0_50px_rgba(8,11,16,0.9)] glow-border-blue overflow-hidden flex flex-col h-[500px] animate-fadeIn">
          {/* Header */}
          <div className="bg-slate-950/90 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5  bg-blue-950/60 border border-blue-500/40 text-blue-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                  LureGuard Assistant
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
                </h3>
                <p className="text-[10px] font-mono text-slate-400">AI Threat & SOC Knowledge Base</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-cyber-panel/90 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3  leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-br-none shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none font-mono text-[11px]'
                  }`}
                >
                  {msg.text}
                </div>

                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{msg.timestamp}</span>

                {/* Suggested Quick Prompt Buttons */}
                {msg.suggestedPrompts && (
                  <div className="mt-2.5 space-y-1.5 w-full">
                    {msg.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(prompt)}
                        className="w-full text-left text-[11px] font-mono px-3 py-1.5  bg-slate-900/80 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-blue-400 transition-all flex items-center justify-between group"
                      >
                        <span>{prompt}</span>
                        <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono bg-slate-900/80 p-2.5  border border-slate-800 w-fit">
                <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                <span>Assistant is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about architecture, sandbox, deploy..."
              className="flex-1 bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs font-mono px-3 py-2  focus:outline-none focus:border-blue-500/50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2  bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 transition-all"
              aria-label="Send Message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
