import { useMemo, useState } from 'react';
import {
  AppBar, Avatar, Box, Button, Chip, Collapse, Divider,
  Drawer, IconButton, List, ListItemButton, ListItemIcon,
  ListItemText, Stack, Toolbar, Tooltip, Typography, alpha,
} from '@mui/material';
import {
  AgricultureOutlined, Analytics, Assignment, BugReport,
  ChevronLeft, Dashboard, GrassOutlined, Inbox,
  LocalFlorist, Logout as LogoutIcon, Menu as MenuIcon,
  Message, Notifications as NotifIcon, Person, Science,
  Settings, Storefront, ThermostatAuto, TrendingUp,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath, ROLE_LABELS } from '../../constants/roles';

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

const ROLE_COLORS = {
  FARMER: { bg: alpha('#22c55e', 0.12), color: '#15803d' },
  CUSTOMER: { bg: alpha('#3b82f6', 0.1), color: '#1d4ed8' },
  ADMIN: { bg: alpha('#8b5cf6', 0.1), color: '#7c3aed' },
};

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/farmer/dashboard', icon: <Dashboard fontSize="small" /> },
  { label: 'Farm Manager', path: '/farmer/farms', icon: <AgricultureOutlined fontSize="small" /> },
  { label: 'My Crops', path: '/farmer/crops', icon: <GrassOutlined fontSize="small" /> },
  { label: 'Marketplace', path: '/farmer/marketplace', icon: <Storefront fontSize="small" /> },
  { label: 'Orders', path: '/farmer/orders', icon: <Inbox fontSize="small" /> },
  { divider: true },
  { label: 'Disease Scanner', path: '/farmer/disease-scanner', icon: <BugReport fontSize="small" /> },
  { label: 'Fertilizer Center', path: '/farmer/fertilizer', icon: <Science fontSize="small" /> },
  { divider: true },
  { label: 'Weather', path: '/farmer/weather', icon: <ThermostatAuto fontSize="small" /> },
  { label: 'Crop Prices', path: '/farmer/crop-prices', icon: <TrendingUp fontSize="small" /> },
  { label: 'Analytics', path: '/farmer/analytics', icon: <Analytics fontSize="small" /> },
  { label: 'Reports', path: '/farmer/reports', icon: <Assignment fontSize="small" /> },
  { divider: true },
  { label: 'Messages', path: '/farmer/messages', icon: <Message fontSize="small" /> },
  { label: 'Notifications', path: '/farmer/notifications', icon: <NotifIcon fontSize="small" /> },
  { divider: true },
  { label: 'Profile', path: '/profile', icon: <Person fontSize="small" /> },
  { label: 'Settings', path: '/settings', icon: <Settings fontSize="small" /> },
];

export default function DashboardLayout({ children, title }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const roleStyle = ROLE_COLORS[user?.role] ?? ROLE_COLORS.CUSTOMER;
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase();

  const drawerWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const sidebar = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f1a0f', overflow: 'hidden' }}>
      {/* Brand header */}
      <Box sx={{ px: collapsed ? 1 : 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 64 }}>
        {!collapsed && (
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
            <Box sx={{ width: 34, height: 34, borderRadius: 2, background: 'linear-gradient(135deg,#2E7D32,#4caf50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AgricultureOutlined sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: 'white', lineHeight: 1.1 }}>CropX</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>AgriTech Platform</Typography>
            </Box>
          </Box>
        )}
        {collapsed && (
          <Box sx={{ width: 34, height: 34, borderRadius: 2, background: 'linear-gradient(135deg,#2E7D32,#4caf50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AgricultureOutlined sx={{ color: 'white', fontSize: 20 }} />
          </Box>
        )}
        <IconButton size="small" onClick={() => setCollapsed(p => !p)} sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: 'white' }, ml: collapsed ? 0 : 1 }}>
          {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Box>

      {/* User info */}
      {!collapsed && (
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, fontSize: 13, fontWeight: 800, background: 'linear-gradient(135deg,#2E7D32,#4caf50)' }}>{initials}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={700} noWrap sx={{ color: 'white', maxWidth: 140 }}>{user?.name || user?.email}</Typography>
              <Chip label={ROLE_LABELS[user?.role] ?? user?.role} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, bgcolor: roleStyle.bg, color: roleStyle.color, borderRadius: 1, mt: 0.25 }} />
            </Box>
          </Box>
        </Box>
      )}
      {collapsed && (
        <Box sx={{ py: 1.5, display: 'flex', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Avatar sx={{ width: 36, height: 36, fontSize: 13, fontWeight: 800 }}>{initials}</Avatar>
        </Box>
      )}

      {/* Nav */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 } }}>
        <List disablePadding dense sx={{ px: collapsed ? 0.5 : 1 }}>
          {NAV_ITEMS.map((item, idx) => {
            if (item.divider) return <Divider key={idx} sx={{ my: 0.75, borderColor: 'rgba(255,255,255,0.06)' }} />;
            const active = location.pathname === item.path;
            return (
              <Tooltip key={item.path} title={collapsed ? item.label : ''} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={active}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2, mb: 0.25, px: collapsed ? 1.5 : 1.5, py: 1,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    minHeight: 40,
                    bgcolor: active ? 'rgba(46,125,50,0.25)' : 'transparent',
                    '&:hover': { bgcolor: active ? 'rgba(46,125,50,0.3)' : 'rgba(255,255,255,0.06)' },
                    '&.Mui-selected': { bgcolor: 'rgba(46,125,50,0.25)' },
                  }}
                >
                  <ListItemIcon sx={{ color: active ? '#4caf50' : 'rgba(255,255,255,0.5)', minWidth: collapsed ? 0 : 32 }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: active ? 700 : 400, color: active ? 'white' : 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* Logout */}
      <Box sx={{ p: collapsed ? 0.5 : 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Tooltip title={collapsed ? 'Log out' : ''} placement="right">
          <Button
            fullWidth
            onClick={handleLogout}
            startIcon={!collapsed ? <LogoutIcon fontSize="small" /> : null}
            sx={{
              color: 'rgba(255,255,255,0.5)', justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 0 : 1.5, py: 1, borderRadius: 2, minWidth: 0,
              '&:hover': { bgcolor: 'rgba(239,68,68,0.12)', color: '#ef4444' },
            }}
          >
            {collapsed ? <LogoutIcon fontSize="small" /> : 'Log out'}
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8faf5' }}>
      {/* Desktop sidebar */}
      <Box component="nav" sx={{ width: drawerWidth, flexShrink: 0, display: { xs: 'none', md: 'block' }, transition: 'width 0.25s ease' }}>
        <Box sx={{ width: drawerWidth, height: '100vh', position: 'sticky', top: 0, transition: 'width 0.25s ease' }}>{sidebar}</Box>
      </Box>

      {/* Mobile drawer */}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
        {sidebar}
      </Drawer>

      {/* Main */}
      <Box component="main" sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary', borderBottom: '1px solid rgba(46,125,50,0.08)' }}>
          <Toolbar sx={{ minHeight: { xs: 60, sm: 64 }, gap: 2 }}>
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            {title && <Typography variant="h6" fontWeight={700} noWrap>{title}</Typography>}
            <Box sx={{ flex: 1 }} />
            <Tooltip title={user?.name || user?.email}>
              <Avatar sx={{ width: 34, height: 34, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>{initials}</Avatar>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Box sx={{ maxWidth: 1280, mx: 'auto' }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
