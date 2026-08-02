import React, { useState } from 'react';
import { InteractiveTerminal } from './InteractiveTerminal';
import { DefensePanel } from './DefensePanel';
import type { AttackScenario } from '../data/attackScenarios';
import { ATTACK_SCENARIOS } from '../data/attackScenarios';

export const SandboxContainer: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<AttackScenario>(ATTACK_SCENARIOS[0]);
  const [simulatedStage, setSimulatedStage] = useState<number>(3); // 0..3 progressive stage

  const handleScenarioChange = (scenarioId: string) => {
    const found = ATTACK_SCENARIOS.find((s) => s.id === scenarioId) || ATTACK_SCENARIOS[0];
    setActiveScenario(found);
    
    // Reset to Stage 0 (Idle / Inbound TCP)
    setSimulatedStage(0);

    // Stage 1 (T=1.2s): Traffic burst & GeoIP detection
    setTimeout(() => {
      setSimulatedStage(1);
    }, 1200);

    // Stage 2 (T=2.8s): Feature extraction & ML Scoring
    setTimeout(() => {
      setSimulatedStage(2);
    }, 2800);

    // Stage 3 (T=4.0s): Honeypot DNAT enforcement & Telegram Alert
    setTimeout(() => {
      setSimulatedStage(3);
    }, 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Interactive Bash Terminal */}
      <div className="lg:col-span-5 w-full">
        <InteractiveTerminal
          activeScenario={activeScenario}
          onSelectScenario={handleScenarioChange}
        />
      </div>

      {/* Right Column: Progressive SOC Triage Center (Fills dynamically stage by stage) */}
      <div className="lg:col-span-7 w-full">
        <DefensePanel
          activeScenario={activeScenario}
          simulatedStage={simulatedStage}
        />
      </div>
    </div>
  );
};
