import React from 'react';
import { TerminalWindow } from './sandbox/TerminalWindow';

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

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = (props) => {
  return <TerminalWindow {...props} />;
};

export { TerminalWindow };
