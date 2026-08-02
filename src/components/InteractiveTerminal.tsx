import React from 'react';
import { TerminalWindow } from './sandbox/TerminalWindow';
import type { AttackScenario } from '../data/attackScenarios';

export interface InteractiveTerminalProps {
  activeScenario?: AttackScenario;
  onSelectScenario?: (scenarioId: string) => void;
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

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = (props) => {
  return <TerminalWindow {...props} />;
};

export { TerminalWindow };

