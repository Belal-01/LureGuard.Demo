import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

export const MatrixToggle: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    const savedState = localStorage.getItem('lureguard_matrix_enabled');
    if (savedState !== null) {
      setEnabled(savedState === 'true');
    }
  }, []);

  const toggleMatrix = () => {
    const nextState = !enabled;
    setEnabled(nextState);
    localStorage.setItem('lureguard_matrix_enabled', String(nextState));

    window.dispatchEvent(
      new CustomEvent('lureguard-toggle-matrix', {
        detail: { enabled: nextState },
      })
    );
  };

  return (
    <button
      onClick={toggleMatrix}
      type="button"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-300 border ${
        enabled
          ? 'bg-slate-900/80 border-cyan-500/40 text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(34,211,238,0.2)]'
          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
      }`}
      title={enabled ? 'Pause Matrix Rain animation' : 'Enable Matrix Rain animation'}
      aria-label="Toggle Matrix Rain Animation"
    >
      <span className="relative flex h-2 w-2">
        {enabled && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            enabled ? 'bg-cyan-400' : 'bg-slate-600'
          }`}
        ></span>
      </span>

      <span>[Matrix: {enabled ? 'ON' : 'OFF'}]</span>
      <Activity className={`w-3.5 h-3.5 ${enabled ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
    </button>
  );
};

