import { useMemo, useState } from 'react';
import { AppBar, Avatar, Box, Button, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Close, Dashboard, Logout, Menu, Person, Settings } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = useMemo(() => {
    const dashboardPath = user?.role === 'FARMER' ? '/farmer/dashboard' : user?.role === 'ADMIN' ? '/admin/dashboard' : '/customer/dashboard';
    return [
      { label: 'Overview', path: dashboardPath, icon: <Dashboard /> },
      { label: 'Profile', path: '/profile', icon: <Person /> },
      { label: 'Settings', path: '/settings', icon: <Settings /> },
    ];
  }, [user?.role]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebar = (
    <Box sx={{ height: '100%', bgcolor: '#F8FAF5', borderRight: '1px solid rgba(46,125,50,0.08)' }}>
      <Toolbar>
        <Avatar sx={{ bgcolor: '#2E7D32', mr: 1.5 }}>CX</Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={800}>CropX</Typography>
          <Typography variant="caption" color="text.secondary">Operations center</Typography>
        </Box>
      </Toolbar>

      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="overline" color="text.secondary">Signed in as</Typography>
        <Typography fontWeight={700}>{user?.name || user?.email}</Typography>
        <Typography variant="body2" color="text.secondary">{user?.role}</Typography>
      </Box>

      <List sx={{ px: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton key={item.path} component={Link} to={item.path} sx={{ borderRadius: 2, mb: 0.5, bgcolor: active ? 'rgba(46,125,50,0.10)' : 'transparent' }}>
              <ListItemIcon sx={{ color: active ? '#2E7D32' : '#64748B', minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 700 : 500 }} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <Button fullWidth variant="outlined" startIcon={<Logout />} onClick={handleLogout} sx={{ borderColor: '#2E7D32', color: '#2E7D32' }}>
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {isMobile ? (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>
          {sidebar}
        </Drawer>
      ) : (
        <Box component="nav" sx={{ width: drawerWidth, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
          {sidebar}
        </Box>
      )}

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'transparent', color: '#1E293B', borderBottom: '1px solid rgba(46,125,50,0.04)' }}>
          <Toolbar>
            {isMobile ? (
              <IconButton edge="start" color="inherit" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                <Menu />
              </IconButton>
            ) : null}
            <Typography variant="h6" fontWeight={800}>Dashboard</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
