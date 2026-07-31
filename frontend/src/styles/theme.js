import { createTheme, alpha } from '@mui/material/styles';

const GREEN = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  main: '#2E7D32',
  dark: '#1b5e20',
  light: '#4caf50',
  contrastText: '#ffffff',
};

const theme = createTheme({
  palette: {
    primary: {
      main: GREEN.main,
      dark: GREEN.dark,
      light: GREEN.light,
      contrastText: GREEN.contrastText,
    },
    secondary: {
      main: '#66BB6A',
      dark: '#388e3c',
      light: '#a5d6a7',
      contrastText: '#ffffff',
    },
    success: {
      main: '#22c55e',
      dark: '#16a34a',
      light: '#86efac',
    },
    warning: {
      main: '#f59e0b',
      dark: '#b45309',
      light: '#fcd34d',
    },
    error: {
      main: '#ef4444',
      dark: '#b91c1c',
      light: '#fca5a5',
    },
    background: {
      default: '#f8faf5',
      paper: '#ffffff',
      subtle: '#f1f5f9',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: 'rgba(46, 125, 50, 0.08)',
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1 },
    h2: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 },
    h3: { fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.2 },
    h4: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
    h5: { fontWeight: 600, lineHeight: 1.4 },
    h6: { fontWeight: 600, lineHeight: 1.5 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 600 },
    body1: { lineHeight: 1.65 },
    body2: { lineHeight: 1.6 },
    button: { fontWeight: 600, letterSpacing: '0.01em' },
    overline: { fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.7rem' },
  },

  shape: { borderRadius: 12 },

  shadows: [
    'none',                                                                      // 0
    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',                  // 1
    '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',        // 2
    '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.05)',      // 3
    '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',     // 4
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 5
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 6
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 7
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 8
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 9
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 10
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 11
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 12
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 13
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 14
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 15
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 16
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 17
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 18
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 19
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 20
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 21
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 22
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 23
    '0 25px 50px -12px rgba(0,0,0,0.15)',                                        // 24
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#f8faf5' },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 999,
          fontWeight: 600,
          letterSpacing: '0.01em',
          transition: 'all 0.18s ease',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${GREEN.main} 0%, ${GREEN.light} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${GREEN.dark} 0%, ${GREEN.main} 100%)`,
            transform: 'translateY(-1px)',
            boxShadow: `0 6px 20px ${alpha(GREEN.main, 0.35)}`,
          },
          '&:active': { transform: 'translateY(0)' },
        },
        outlinedPrimary: {
          borderColor: alpha(GREEN.main, 0.4),
          '&:hover': {
            borderColor: GREEN.main,
            backgroundColor: alpha(GREEN.main, 0.04),
          },
        },
        sizeLarge: { padding: '12px 28px', fontSize: '1rem' },
        sizeMedium: { padding: '9px 20px' },
        sizeSmall: { padding: '6px 14px', fontSize: '0.8125rem' },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(46,125,50,0.08)',
          boxShadow: '0 4px 24px rgba(46,125,50,0.06)',
          transition: 'box-shadow 0.2s ease',
          '&:hover': { boxShadow: '0 8px 40px rgba(46,125,50,0.10)' },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        elevation1: { boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
        elevation2: { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
      },
    },

    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'box-shadow 0.18s ease',
            '&.Mui-focused': {
              boxShadow: `0 0 0 3px ${alpha(GREEN.main, 0.12)}`,
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(46,125,50,0.2)',
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(GREEN.main, 0.5),
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
        colorPrimary: {
          backgroundColor: alpha(GREEN.main, 0.1),
          color: GREEN.main,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginBottom: 2,
          transition: 'all 0.15s ease',
          '&.Mui-selected': {
            backgroundColor: alpha(GREEN.main, 0.1),
            color: GREEN.main,
            '&:hover': { backgroundColor: alpha(GREEN.main, 0.14) },
          },
          '&:hover': { backgroundColor: alpha(GREEN.main, 0.06) },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
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

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(46,125,50,0.08)' },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: '0.75rem',
          fontWeight: 500,
          backgroundColor: '#1e293b',
        },
      },
    },
  },
});

export default theme;
