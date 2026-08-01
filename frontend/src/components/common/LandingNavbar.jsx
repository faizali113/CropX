/**
 * LandingNavbar — public-only navbar shown on the landing page and auth pages.
 * Contains exactly: CropX logo (left) · Login · Sign Up · Theme Toggle (right).
 * No extra links, no user menu — clean and focused.
 */
import { useEffect, useState } from 'react';
import {
  AppBar, Box, Button, Container, Drawer, IconButton,
  List, ListItemButton, ListItemText, Stack, Toolbar, Typography, alpha, Divider,
} from '@mui/material';
import {
  AgricultureOutlined, Close as CloseIcon,
  DarkMode, LightMode, Menu as MenuIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useThemeToggle } from '../../context/ThemeContext';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toggleTheme, isDark } = useThemeToggle();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: scrolled
            ? (isDark ? 'rgba(13,27,14,0.96)' : 'rgba(255,255,255,0.96)')
            : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          color: 'text.primary',
          borderBottom: scrolled ? '1px solid' : 'none',
          borderColor: 'divider',
          transition: 'all 0.25s ease',
          boxShadow: 'none',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 } }}>
            {/* ── Logo ─────────────────────────────────────────────────── */}
            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', flexGrow: 1 }}
            >
              <Box
                sx={{
                  width: 38, height: 38, borderRadius: 2.5,
                  background: 'linear-gradient(135deg,#2E7D32 0%,#4caf50 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(46,125,50,0.35)',
                }}
              >
                <AgricultureOutlined sx={{ color: 'white', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={900}
                  sx={{
                    lineHeight: 1.1,
                    background: isDark
                      ? 'linear-gradient(90deg,#4caf50,#a5d6a7)'
                      : 'linear-gradient(90deg,#1b5e20,#2E7D32)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  CropX
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1, fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                  SMART AGRICULTURE
                </Typography>
              </Box>
            </Box>

            {/* ── Desktop: Login · Sign Up · Theme ─────────────────────── */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
                component={Link}
                to="/login"
                variant="text"
                sx={{ color: 'text.secondary', fontWeight: 600, px: 2, '&:hover': { color: 'primary.main', bgcolor: alpha('#2E7D32', 0.06) } }}
              >
                Log in
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                sx={{
                  px: 3,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg,#2E7D32,#4caf50)',
                  boxShadow: '0 4px 14px rgba(46,125,50,0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg,#1b5e20,#2E7D32)',
                    boxShadow: '0 6px 20px rgba(46,125,50,0.5)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Sign up free
              </Button>
              <IconButton
                size="small"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                sx={{ color: 'text.secondary', ml: 0.5, '&:hover': { color: 'primary.main', bgcolor: alpha('#2E7D32', 0.06) } }}
              >
                {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
              </IconButton>
            </Stack>

            {/* ── Mobile: theme + hamburger ─────────────────────────────── */}
            <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="small" onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
                {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
              </IconButton>
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'text.secondary' }}>
                <MenuIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Spacer so content doesn't hide under the fixed AppBar */}
      <Toolbar sx={{ minHeight: { xs: 64, sm: 72 } }} />

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            bgcolor: isDark ? '#0d1b0e' : 'white',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, background: 'linear-gradient(135deg,#2E7D32,#4caf50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AgricultureOutlined sx={{ color: 'white', fontSize: 16 }} />
              </Box>
              <Typography variant="subtitle1" fontWeight={800} color="primary.main">CropX</Typography>
            </Stack>
            <IconButton size="small" onClick={() => setDrawerOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 1 }} />
          <List disablePadding>
            <ListItemButton component={Link} to="/login" onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 2, mb: 0.5 }}>
              <ListItemText primary="Log in" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/signup"
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 2, bgcolor: alpha('#2E7D32', 0.1), color: 'primary.main' }}
            >
              <ListItemText primary="Sign up free" primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
