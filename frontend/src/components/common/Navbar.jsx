import { useState } from 'react';
import { AppBar, Avatar, Box, Button, Chip, Container, Drawer, IconButton, List, ListItemButton, ListItemText, Stack, Toolbar, Typography } from '@mui/material';
import { Close, Logout, Menu } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const publicLinks = [
  { label: 'Platform', to: '/' },
  { label: 'Login', to: '/login' },
  { label: 'Create Account', to: '/signup' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'FARMER':
        return '/farmer/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/customer/dashboard';
    }
  };

  const links = user ? [{ label: 'Dashboard', to: getDashboardPath(user.role) }, { label: 'Profile', to: '/profile' }] : publicLinks;

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ background: 'rgba(248,250,245,0.9)', backdropFilter: 'blur(16px)', color: '#1E293B', borderBottom: '1px solid rgba(46,125,50,0.08)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 68, sm: 76 } }}>
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexGrow: 1 }}>
              <Avatar sx={{ bgcolor: '#2E7D32', width: 36, height: 36, fontSize: 16, fontWeight: 800 }}>CX</Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.05 }}>CropX</Typography>
                <Typography variant="caption" color="text.secondary">Smart agriculture</Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {links.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Button key={link.to} component={Link} to={link.to} sx={{ color: active ? '#2E7D32' : '#1E293B', fontWeight: active ? 700 : 500 }}>
                    {link.label}
                  </Button>
                );
              })}
              {user ? (
                <Button color="inherit" onClick={handleLogout} startIcon={<Logout />} sx={{ color: '#1E293B', fontWeight: 600 }}>
                  Logout
                </Button>
              ) : (
                <Button component={Link} to="/signup" variant="contained" sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#256b28' } }}>
                  Get Started
                </Button>
              )}
            </Stack>

            <IconButton onClick={() => setOpen(true)} sx={{ display: { xs: 'flex', md: 'none' } }}>
              <Menu />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={800}>Menu</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
          <List>
            {links.map((link) => (
              <ListItemButton key={link.to} component={Link} to={link.to} onClick={() => setOpen(false)}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            {user ? (
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            ) : (
              <ListItemButton component={Link} to="/signup" onClick={() => setOpen(false)}>
                <ListItemText primary="Get Started" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
