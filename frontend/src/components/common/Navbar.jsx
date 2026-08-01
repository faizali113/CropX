import { useEffect, useRef, useState } from 'react';
import {
  AppBar, Avatar, Badge, Box, Button, Container, Divider,
  Drawer, IconButton, InputAdornment, List, ListItemButton,
  ListItemIcon, ListItemText, Menu, MenuItem, Stack,
  TextField, Toolbar, Typography, alpha,
} from '@mui/material';
import {
  AgricultureOutlined, Close as CloseIcon, DarkMode,
  HelpOutlined, LightMode, LogoutOutlined,
  Menu as MenuIcon, Message, NotificationsOutlined,
  Person, Search, Settings, Storefront, ThermostatAuto,
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
  const [darkMode] = useState(false);
  const [avatarAnchor, setAvatarAnchor] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setAvatarAnchor(null);
    setDrawerOpen(false);
    await logout();
    navigate('/login');
  };

  const links = user
    ? [{ label: 'Dashboard', to: getDashboardPath(user.role) }, { label: 'Profile', to: '/profile' }]
    : publicLinks;

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase();

  const avatarMenuItems = [
    { label: 'My Profile', icon: <Person fontSize="small" />, to: '/profile' },
    { label: 'Farm Information', icon: <AgricultureOutlined fontSize="small" />, to: '/farmer/farms' },
    { label: 'Account Settings', icon: <Settings fontSize="small" />, to: '/settings' },
    { label: 'Help', icon: <HelpOutlined fontSize="small" />, to: '/' },
  ];

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{
        bgcolor: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(248,250,245,0.92)',
        backdropFilter: 'blur(20px)', color: 'text.primary',
        borderBottom: '1px solid', borderColor: scrolled ? 'divider' : 'transparent',
        transition: 'all 0.2s ease',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
      }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 }, gap: 1 }}>
            {/* Logo */}
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none', flexShrink: 0 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg,#2E7D32 0%,#4caf50 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AgricultureOutlined sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle1" fontWeight={800} color="text.primary" lineHeight={1.1}>CropX</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>Smart agriculture</Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* Desktop nav */}
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              {links.map(link => {
                const active = location.pathname === link.to;
                return (
                  <Button key={link.to} component={Link} to={link.to} size="small"
                    sx={{ color: active ? 'primary.main' : 'text.secondary', fontWeight: active ? 700 : 500, '&:hover': { color: 'primary.main', bgcolor: alpha('#2E7D32', 0.06) } }}>
                    {link.label}
                  </Button>
                );
              })}

              {user ? (
                <>
                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <ThermostatAuto fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
                      <NotificationsOutlined fontSize="small" />
                    </Badge>
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <Message fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    {darkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                  </IconButton>
                  <IconButton size="small" onClick={e => setAvatarAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 800 }}>{initials}</Avatar>
                  </IconButton>
                </>
              ) : (
                <Button component={Link} to="/signup" variant="contained" size="small" sx={{ ml: 1 }}>Get started</Button>
              )}
            </Stack>

            {/* Mobile hamburger */}
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ display: { xs: 'flex', md: 'none' } }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Avatar dropdown menu */}
      <Menu anchorEl={avatarAnchor} open={Boolean(avatarAnchor)} onClose={() => setAvatarAnchor(null)}
        PaperProps={{ sx: { mt: 1, minWidth: 200, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" fontWeight={700}>{user?.name || user?.email}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
        </Box>
        {avatarMenuItems.map(item => (
          <MenuItem key={item.to} onClick={() => { navigate(item.to); setAvatarAnchor(null); }}
            sx={{ gap: 1.5, py: 1, '&:hover': { bgcolor: alpha('#2E7D32', 0.06) } }}>
            <ListItemIcon sx={{ minWidth: 0, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
            <Typography variant="body2">{item.label}</Typography>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1, color: 'error.main', '&:hover': { bgcolor: alpha('#ef4444', 0.06) } }}>
          <ListItemIcon sx={{ minWidth: 0, color: 'error.main' }}><LogoutOutlined fontSize="small" /></ListItemIcon>
          <Typography variant="body2" color="error.main">Log out</Typography>
        </MenuItem>
      </Menu>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 280 } }}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" fontWeight={800}>Menu</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
          </Stack>
          <Divider sx={{ mb: 1 }} />
          <List disablePadding>
            {links.map(link => (
              <ListItemButton key={link.to} component={Link} to={link.to} onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 500 }} />
              </ListItemButton>
            ))}
            {user ? (
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main', mt: 0.5 }}>
                <ListItemText primary="Log out" primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            ) : (
              <ListItemButton component={Link} to="/signup" onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 2, bgcolor: alpha('#2E7D32', 0.08), color: 'primary.main', mt: 1 }}>
                <ListItemText primary="Get started" primaryTypographyProps={{ fontWeight: 700 }} />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
