import { useEffect, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  alpha,
} from '@mui/material';
import {
  AgricultureOutlined,
  Close as CloseIcon,
  LogoutOutlined,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath } from '../../constants/roles';

const publicLinks = [
  { label: 'Home', to: '/' },
  { label: 'Sign in', to: '/login' },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Scroll listener lives in useEffect — never in the render body
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setDrawerOpen(false);
    await logout();
    navigate('/login');
  };

  const links = user
    ? [
        { label: 'Dashboard', to: getDashboardPath(user.role) },
        { label: 'Profile', to: '/profile' },
      ]
    : publicLinks;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(248,250,245,0.92)',
          backdropFilter: 'blur(20px)',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: scrolled ? 'divider' : 'transparent',
          transition: 'all 0.2s ease',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 } }}>
            {/* ── Logo ─────────────────────────────────────────────── */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                flexGrow: 1,
                textDecoration: 'none',
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #2E7D32 0%, #4caf50 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AgricultureOutlined sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  color="text.primary"
                  lineHeight={1.1}
                >
                  CropX
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', lineHeight: 1 }}
                >
                  Smart agriculture
                </Typography>
              </Box>
            </Box>

            {/* ── Desktop nav links ────────────────────────────────── */}
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              {links.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Button
                    key={link.to}
                    component={Link}
                    to={link.to}
                    sx={{
                      color: active ? 'primary.main' : 'text.secondary',
                      fontWeight: active ? 700 : 500,
                      px: 1.5,
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: alpha('#2E7D32', 0.06),
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                );
              })}

              {user ? (
                <>
                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 800 }}>
                      {(user.name?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()}
                    </Avatar>
                    <Button
                      startIcon={<LogoutOutlined />}
                      onClick={handleLogout}
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        '&:hover': { color: 'error.main', bgcolor: 'transparent' },
                      }}
                    >
                      Log out
                    </Button>
                  </Stack>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  size="small"
                  sx={{ ml: 1 }}
                >
                  Get started
                </Button>
              )}
            </Stack>

            {/* ── Mobile hamburger ─────────────────────────────────── */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' } }}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography variant="h6" fontWeight={800}>
              Menu
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 1 }} />
          <List disablePadding>
            {links.map((link) => (
              <ListItemButton
                key={link.to}
                component={Link}
                to={link.to}
                onClick={() => setDrawerOpen(false)}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>
            ))}

            {user ? (
              <ListItemButton
                onClick={handleLogout}
                sx={{ borderRadius: 2, color: 'error.main', mt: 0.5 }}
              >
                <ListItemText
                  primary="Log out"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            ) : (
              <ListItemButton
                component={Link}
                to="/signup"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  bgcolor: alpha('#2E7D32', 0.08),
                  color: 'primary.main',
                  mt: 1,
                }}
              >
                <ListItemText
                  primary="Get started"
                  primaryTypographyProps={{ fontWeight: 700 }}
                />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
