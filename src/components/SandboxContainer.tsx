import React, { useState } from 'react';
import { InteractiveTerminal } from './InteractiveTerminal';
import { DefensePanel } from './DefensePanel';
import type { ScenarioData } from './DefensePanel';

export const SandboxContainer: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<ScenarioData>({
    name: 'SSH Brute-Force (Cowrie Trap)',
    threatScore: 94,
    reqPerSec: 480,
    ip: '185.220.101.5',
    location: 'Frankfurt, Germany',
    isTor: true,
    ruleId: 5710,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Interactive Bash Terminal (Mode A Presets + Mode B Custom CLI) */}
      <div className="lg:col-span-7 w-full">
        <InteractiveTerminal onAttackTriggered={(data) => setActiveScenario(data)} />
      </div>

      {/* Right Column: Real-time Defense Panel */}
      <div className="lg:col-span-5 w-full">
        <DefensePanel scenario={activeScenario} />
      </div>
    </div>
  );
};
