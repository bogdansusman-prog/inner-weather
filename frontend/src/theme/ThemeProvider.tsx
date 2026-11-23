import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';

const THEME_KEY = 'inner-weather:theme';

// tema salvata din vizita trecuta; Light daca nu exista sau e ceva necunoscut
function savedTheme(): Theme {
  try {
    // ce vine din localStorage se verifica, nu se "castuieste" cu `as`
    return localStorage.getItem(THEME_KEY) === 'midnight' ? 'midnight' : 'light';
  } catch {
    return 'light';
  }
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(savedTheme);

  // <html data-theme="midnight">: dupa atributul asta CSS-ul schimba culorile.
  // E in useEffect pentru ca modifica pagina in afara React; randarea trebuie sa ramana "curata".
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function setTheme(next: Theme) {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // fara localStorage: tema tine doar pana la refresh
    }
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
