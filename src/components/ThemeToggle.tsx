import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Determine current theme from DOM
    const isLight = document.documentElement.classList.contains('light');
    setTheme(isLight ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }

    localStorage.setItem('lureguard_theme', nextTheme);
    window.dispatchEvent(
      new CustomEvent('lureguard-theme-change', { detail: { theme: nextTheme } })
    );
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all duration-300 border bg-slate-200/80 dark:bg-slate-900/80 border-slate-300/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 shadow-sm cursor-pointer select-none"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Light and Dark Mode"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45 duration-300" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-cyan-600 transition-transform hover:-rotate-12 duration-300" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
};
