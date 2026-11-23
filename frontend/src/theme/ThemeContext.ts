import { createContext, useContext } from 'react';

export type Theme = 'light' | 'midnight';

type ThemeValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeValue | null>(null);

// hook-ul pe care il folosesc componentele: const { theme, setTheme } = useTheme();
export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider');
  return value;
}
