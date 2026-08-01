import { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeToggleContext = createContext({ toggleTheme: () => {}, isDark: false });

export function useThemeToggle() {
  return useContext(ThemeToggleContext);
}

const GREEN = {
  main: '#2E7D32',
  dark: '#1b5e20',
  light: '#4caf50',
  contrastText: '#ffffff',
};

function buildTheme(mode) {
  const isDark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: { main: GREEN.main, dark: GREEN.dark, light: GREEN.light, contrastText: GREEN.contrastText },
      secondary: { main: '#66BB6A', dark: '#388e3c', light: '#a5d6a7', contrastText: '#ffffff' },
      success: { main: '#22c55e', dark: '#16a34a', light: '#86efac' },
      warning: { main: '#f59e0b', dark: '#b45309', light: '#fcd34d' },
      error: { main: '#ef4444', dark: '#b91c1c', light: '#fca5a5' },
      background: {
        default: isDark ? '#0d1b0e' : '#f8faf5',
        paper: isDark ? '#152015' : '#ffffff',
      },
      text: {
        primary: isDark ? '#e8f5e9' : '#1e293b',
        secondary: isDark ? '#a5d6a7' : '#64748b',
        disabled: isDark ? '#558b5a' : '#94a3b8',
      },
      divider: isDark ? 'rgba(76,175,80,0.12)' : 'rgba(46,125,50,0.08)',
    },
    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      h1: { fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1 },
      h2: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 },
      h3: { fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.2 },
      h4: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
      h5: { fontWeight: 600, lineHeight: 1.4 },
      h6: { fontWeight: 600, lineHeight: 1.5 },
      button: { fontWeight: 600, letterSpacing: '0.01em' },
      overline: { fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.7rem' },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: isDark ? '#0d1b0e' : '#f8faf5' },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: 'none', borderRadius: 999, fontWeight: 600 },
          containedPrimary: {
            background: `linear-gradient(135deg, ${GREEN.main} 0%, ${GREEN.light} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${GREEN.dark} 0%, ${GREEN.main} 100%)`,
              transform: 'translateY(-1px)',
              boxShadow: `0 6px 20px ${alpha(GREEN.main, 0.35)}`,
            },
            '&:active': { transform: 'translateY(0)' },
          },
          sizeLarge: { padding: '12px 28px', fontSize: '1rem' },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${isDark ? 'rgba(76,175,80,0.12)' : 'rgba(46,125,50,0.08)'}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiAppBar: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              '&.Mui-focused': {
                boxShadow: `0 0 0 3px ${alpha(GREEN.main, 0.12)}`,
              },
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            marginBottom: 2,
            '&.Mui-selected': {
              backgroundColor: alpha(GREEN.main, isDark ? 0.2 : 0.1),
              color: GREEN.light,
              '&:hover': { backgroundColor: alpha(GREEN.main, isDark ? 0.25 : 0.14) },
            },
            '&:hover': { backgroundColor: alpha(GREEN.main, isDark ? 0.1 : 0.06) },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 700,
            background: `linear-gradient(135deg, ${GREEN.main} 0%, ${GREEN.light} 100%)`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 600 },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isDark ? 'rgba(76,175,80,0.12)' : 'rgba(46,125,50,0.08)' },
        },
      },
    },
  });
}

export function AppThemeProvider({ children }) {
  const storedMode = localStorage.getItem('cropx-theme') || 'light';
  const [mode, setMode] = useState(storedMode);

  const toggleTheme = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('cropx-theme', next);
      return next;
    });
  };

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeToggleContext.Provider value={{ toggleTheme, isDark: mode === 'dark' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
}
