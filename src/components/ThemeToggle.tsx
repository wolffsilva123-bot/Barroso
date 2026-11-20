import {Moon, Sun} from 'lucide-react';
import {type ThemeMode} from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
}

export function ThemeToggle({theme, onToggle}: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      aria-pressed={isDark}
      className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A88F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F9FA] dark:focus-visible:ring-offset-slate-950 whitespace-nowrap shrink-0 cursor-pointer"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
          <span>Tema claro</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-slate-600 shrink-0" aria-hidden="true" />
          <span>Tema escuro</span>
        </>
      )}
    </button>
  );
}
