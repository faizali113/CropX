import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppBar, Avatar, Badge, Box, Button, Chip, ClickAwayListener,
  Divider, Drawer, Grow, IconButton, InputAdornment, List,
  ListItemButton, ListItemIcon, ListItemText, MenuItem, MenuList,
  Paper, Popper, Stack, TextField, Toolbar, Tooltip, Typography, alpha,
} from '@mui/material';
import {
  AgricultureOutlined, BugReport, ChevronLeft, DarkMode,
  Dashboard, GrassOutlined, Inbox, LightMode, Logout as LogoutIcon,
  Menu as MenuIcon, Message, Notifications as NotifIcon,
  Person, Science, Settings, ShoppingCartOutlined, Storefront,
  ThermostatAuto, TrendingUp, SearchOutlined,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeToggle } from '../../context/ThemeContext';
import { getDashboardPath, ROLE_LABELS } from '../../constants/roles';
import api from '../../services/api';

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

const ROLE_COLORS = {
  FARMER: { bg: alpha('#22c55e', 0.12), color: '#15803d' },
  CUSTOMER: { bg: alpha('#3b82f6', 0.1), color: '#1d4ed8' },
  ADMIN: { bg: alpha('#8b5cf6', 0.1), color: '#7c3aed' },
};

const FARMER_NAV = [
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
  { divider: true },
  { label: 'Messages', path: '/farmer/messages', icon: <Message fontSize="small" /> },
  { label: 'Notifications', path: '/farmer/notifications', icon: <NotifIcon fontSize="small" /> },
  { divider: true },
  { label: 'Profile', path: '/profile', icon: <Person fontSize="small" /> },
  { label: 'Settings', path: '/settings', icon: <Settings fontSize="small" /> },
];

const CUSTOMER_NAV = [
  { label: 'Dashboard', path: '/customer/dashboard', icon: <Dashboard fontSize="small" /> },
  { divider: true },
  { label: 'Browse Farms', path: '/customer/farms', icon: <AgricultureOutlined fontSize="small" /> },
  { label: 'Marketplace', path: '/customer/marketplace', icon: <Storefront fontSize="small" /> },
  { label: 'My Orders', path: '/customer/orders', icon: <ShoppingCartOutlined fontSize="small" /> },
  { label: 'Crop Scanner', path: '/customer/scan', icon: <BugReport fontSize="small" /> },
  { divider: true },
  { label: 'Messages', path: '/customer/messages', icon: <Message fontSize="small" /> },
  { divider: true },
  { label: 'Profile', path: '/profile', icon: <Person fontSize="small" /> },
  { label: 'Settings', path: '/settings', icon: <Settings fontSize="small" /> },
];

const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <Dashboard fontSize="small" /> },
  { divider: true },
  { label: 'Profile', path: '/profile', icon: <Person fontSize="small" /> },
  { label: 'Settings', path: '/settings', icon: <Settings fontSize="small" /> },
];

function getNavItems(role) {
  if (role === 'FARMER') return FARMER_NAV;
  if (role === 'CUSTOMER') return CUSTOMER_NAV;
  return ADMIN_NAV;
}

// ── Farmer top bar ───────────────────────────────────────────────────────────
function FarmerTopBar({ initials, onMenuOpen, onMobileToggle, title }) {
  const { toggleTheme, isDark } = useThemeToggle();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [avatarAnchor, setAvatarAnchor] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    api.get('/notifications/').then(({ data }) => {
      const list = data.results ?? data;
      setUnread(list.filter(n => !n.is_read).length);
    }).catch(() => {});
  }, []);

  const handleLogout = async () => {
    setAvatarAnchor(null);
    await logout();
    navigate('/login');
  };

  const farmerMenuItems = [
    { label: 'My Profile', to: '/profile' },
    { label: 'Farm Information', to: '/farmer/farms' },
    { label: 'Account Settings', to: '/settings' },
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ minHeight: { xs: 60, sm: 64 }, gap: 1.5 }}>
        <IconButton edge="start" onClick={onMobileToggle} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        {/* Logo mark visible on mobile */}
        <Box component={Link} to="/" sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, textDecoration: 'none' }}>
          <Box sx={{ width: 30, height: 30, borderRadius: 1.5, background: 'linear-gradient(135deg,#2E7D32,#4caf50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AgricultureOutlined sx={{ color: 'white', fontSize: 18 }} />
          </Box>
        </Box>

        {title && <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ display: { xs: 'none', sm: 'block' } }}>{title}</Typography>}
        <Box sx={{ flex: 1 }} />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton size="small" component={Link} to="/farmer/notifications" sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={unread || null} color="error" max={9} sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
              <NotifIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Messages */}
        <Tooltip title="Messages">
          <IconButton size="small" component={Link} to="/farmer/messages" sx={{ color: 'text.secondary' }}>
            <Message fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Theme toggle */}
        <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton size="small" onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
            {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1.5 }} />

        {/* Avatar + role chip */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }} onClick={e => setAvatarAnchor(e.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 800 }}>{initials}</Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="caption" fontWeight={700} display="block" lineHeight={1.2}>{user?.name?.split(' ')[0] || 'Farmer'}</Typography>
            <Chip label="Farmer" size="small" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, bgcolor: alpha('#22c55e', 0.1), color: '#15803d', borderRadius: 0.75 }} />
          </Box>
        </Stack>
      </Toolbar>

      {/* Avatar dropdown */}
      {Boolean(avatarAnchor) && (
        <ClickAwayListener onClickAway={() => setAvatarAnchor(null)}>
          <Paper sx={{ position: 'fixed', top: 72, right: 16, zIndex: 1400, minWidth: 200, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" fontWeight={700}>{user?.name || user?.email}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            {farmerMenuItems.map(item => (
              <MenuItem key={item.to} onClick={() => { navigate(item.to); setAvatarAnchor(null); }} sx={{ py: 1 }}>
                <Typography variant="body2">{item.label}</Typography>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1, color: 'error.main' }}>
              <Typography variant="body2" color="error.main">Log out</Typography>
            </MenuItem>
          </Paper>
        </ClickAwayListener>
      )}
    </AppBar>
  );
}

// ── Customer top bar ─────────────────────────────────────────────────────────
function CustomerTopBar({ initials, onMobileToggle, title }) {
  const { toggleTheme, isDark } = useThemeToggle();
  const navigate = useNavigate();
  const [avatarAnchor, setAvatarAnchor] = useState(null);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    setAvatarAnchor(null);
    await logout();
    navigate('/login');
  };

  const customerMenuItems = [
    { label: 'My Profile', to: '/profile' },
    { label: 'My Orders', to: '/customer/orders' },
    { label: 'Account Settings', to: '/settings' },
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ minHeight: { xs: 60, sm: 64 }, gap: 1.5 }}>
        <IconButton edge="start" onClick={onMobileToggle} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        {/* Logo on mobile */}
        <Box component={Link} to="/" sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, textDecoration: 'none' }}>
          <Box sx={{ width: 30, height: 30, borderRadius: 1.5, background: 'linear-gradient(135deg,#2E7D32,#4caf50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AgricultureOutlined sx={{ color: 'white', fontSize: 18 }} />
          </Box>
        </Box>

        {title && <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ display: { xs: 'none', sm: 'block' } }}>{title}</Typography>}
        <Box sx={{ flex: 1 }} />

        {/* Messages */}
        <Tooltip title="Messages">
          <IconButton size="small" component={Link} to="/customer/messages" sx={{ color: 'text.secondary' }}>
            <Message fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Theme toggle */}
        <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton size="small" onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
            {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1.5 }} />

        {/* Avatar + role chip */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }} onClick={e => setAvatarAnchor(e.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 800, background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>{initials}</Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="caption" fontWeight={700} display="block" lineHeight={1.2}>{user?.name?.split(' ')[0] || 'Customer'}</Typography>
            <Chip label="Customer" size="small" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, bgcolor: alpha('#3b82f6', 0.1), color: '#1d4ed8', borderRadius: 0.75 }} />
          </Box>
        </Stack>
      </Toolbar>

      {Boolean(avatarAnchor) && (
        <ClickAwayListener onClickAway={() => setAvatarAnchor(null)}>
          <Paper sx={{ position: 'fixed', top: 72, right: 16, zIndex: 1400, minWidth: 200, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" fontWeight={700}>{user?.name || user?.email}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            {customerMenuItems.map(item => (
              <MenuItem key={item.to} onClick={() => { navigate(item.to); setAvatarAnchor(null); }} sx={{ py: 1 }}>
                <Typography variant="body2">{item.label}</Typography>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1, color: 'error.main' }}>
              <Typography variant="body2" color="error.main">Log out</Typography>
            </MenuItem>
          </Paper>
        </ClickAwayListener>
      )}
    </AppBar>
  );
}

// ── Main DashboardLayout ──────────────────────────────────────────────────────
export default function DashboardLayout({ children, title }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useThemeToggle();

  const navItems = useMemo(() => getNavItems(user?.role), [user?.role]);
  const handleLogout = async () => { await logout(); navigate('/login'); };

  const roleStyle = ROLE_COLORS[user?.role] ?? ROLE_COLORS.CUSTOMER;
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase();

  const drawerWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const sidebar = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f1a0f', overflow: 'hidden' }}>
      {/* Brand */}
      <Box sx={{
        px: collapsed ? 1 : 2.5, py: 2,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 64,
      }}>
        {!collapsed && (
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
            <Box sx={{ width: 34, height: 34, borderRadius: 2, background: 'linear-gradient(135deg,#2E7D32,#4caf50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AgricultureOutlined sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: 'white', lineHeight: 1.1 }}>CropX</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
                {user?.role === 'FARMER' ? 'Farmer Portal' : user?.role === 'CUSTOMER' ? 'Customer Portal' : 'Admin Portal'}
              </Typography>
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
      {!collapsed ? (
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 36, height: 36, fontSize: 13, fontWeight: 800 }}>{initials}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={700} noWrap sx={{ color: 'white', maxWidth: 140 }}>{user?.name || user?.email}</Typography>
              <Chip label={ROLE_LABELS[user?.role] ?? user?.role} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, bgcolor: roleStyle.bg, color: roleStyle.color, borderRadius: 1, mt: 0.25 }} />
            </Box>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ py: 1.5, display: 'flex', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Tooltip title={user?.name || user?.email} placement="right">
            <Avatar sx={{ width: 36, height: 36, fontSize: 13, fontWeight: 800 }}>{initials}</Avatar>
          </Tooltip>
        </Box>
      )}

      {/* Nav */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 } }}>
        <List disablePadding dense sx={{ px: collapsed ? 0.5 : 1 }}>
          {navItems.map((item, idx) => {
            if (item.divider) return <Divider key={idx} sx={{ my: 0.75, borderColor: 'rgba(255,255,255,0.06)' }} />;
            const active = location.pathname === item.path;
            return (
              <Tooltip key={item.path} title={collapsed ? item.label : ''} placement="right">
                <ListItemButton component={Link} to={item.path} selected={active} onClick={() => setMobileOpen(false)}
                  sx={{ borderRadius: 2, mb: 0.25, px: 1.5, py: 1, justifyContent: collapsed ? 'center' : 'flex-start', minHeight: 40, bgcolor: active ? 'rgba(46,125,50,0.25)' : 'transparent', '&:hover': { bgcolor: active ? 'rgba(46,125,50,0.3)' : 'rgba(255,255,255,0.06)' }, '&.Mui-selected': { bgcolor: 'rgba(46,125,50,0.25)' } }}>
                  <ListItemIcon sx={{ color: active ? '#4caf50' : 'rgba(255,255,255,0.5)', minWidth: collapsed ? 0 : 32 }}>{item.icon}</ListItemIcon>
                  {!collapsed && <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2', fontWeight: active ? 700 : 400, color: active ? 'white' : 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }} />}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* Bottom */}
      <Box sx={{ p: collapsed ? 0.5 : 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {!collapsed ? (
          <Button fullWidth onClick={toggleTheme} startIcon={isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            sx={{ color: 'rgba(255,255,255,0.4)', justifyContent: 'flex-start', px: 1.5, py: 0.75, borderRadius: 2, mb: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: 'white' } }}>
            {isDark ? 'Light mode' : 'Dark mode'}
          </Button>
        ) : (
          <Tooltip title={isDark ? 'Light mode' : 'Dark mode'} placement="right">
            <IconButton size="small" onClick={toggleTheme} sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: 'white' }, width: '100%', borderRadius: 2, mb: 0.5 }}>
              {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={collapsed ? 'Log out' : ''} placement="right">
          <Button fullWidth onClick={handleLogout} startIcon={!collapsed ? <LogoutIcon fontSize="small" /> : null}
            sx={{ color: 'rgba(255,255,255,0.5)', justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 0 : 1.5, py: 1, borderRadius: 2, minWidth: 0, '&:hover': { bgcolor: 'rgba(239,68,68,0.12)', color: '#ef4444' } }}>
            {collapsed ? <LogoutIcon fontSize="small" /> : 'Log out'}
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );

  // Pick correct top bar based on role
  const TopBar = user?.role === 'FARMER'
    ? <FarmerTopBar initials={initials} onMobileToggle={() => setMobileOpen(true)} title={title} />
    : user?.role === 'CUSTOMER'
    ? <CustomerTopBar initials={initials} onMobileToggle={() => setMobileOpen(true)} title={title} />
    : (
      /* Admin / fallback generic top bar */
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ minHeight: { xs: 60, sm: 64 }, gap: 2 }}>
          <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }}><MenuIcon /></IconButton>
          {title && <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ display: { xs: 'none', sm: 'block' } }}>{title}</Typography>}
          <Box sx={{ flex: 1 }} />
          <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
            <IconButton size="small" onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
              {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title={user?.name || user?.email}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>{initials}</Avatar>
          </Tooltip>
        </Toolbar>
      </AppBar>
    );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="nav" sx={{ width: drawerWidth, flexShrink: 0, display: { xs: 'none', md: 'block' }, transition: 'width 0.25s ease' }}>
        <Box sx={{ width: drawerWidth, height: '100vh', position: 'sticky', top: 0, transition: 'width 0.25s ease' }}>{sidebar}</Box>
      </Box>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
        {sidebar}
      </Drawer>

      <Box component="main" sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {TopBar}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Box sx={{ maxWidth: 1280, mx: 'auto' }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
