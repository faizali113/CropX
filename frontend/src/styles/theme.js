import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#2E7D32' },
    secondary: { main: '#66BB6A' },
    accent: { main: '#FFC107' },
    background: { default: '#F8FAF5', paper: '#FFFFFF' },
    text: { primary: '#1E293B', secondary: '#64748B' },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 999 } } },
    MuiCard: { styleOverrides: { root: { boxShadow: '0 10px 30px rgba(46, 125, 50, 0.08)' } } },
  },
});

export default theme;
