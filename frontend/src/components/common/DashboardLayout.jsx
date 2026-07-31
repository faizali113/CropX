import { useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import {
  AgricultureOutlined,
  DashboardOutlined,
  LogoutOutlined,
  Menu as MenuIcon,
  PersonOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath, ROLE_LABELS } from '../../constants/roles';

const DRAWER_WIDTH = 272;

const ROLE_COLORS = {
  FARMER: { bg: alpha('#22c55e', 0.12), color: '#15803d' },
  CUSTOMER: { bg: alpha('#3b82f6', 0.1), color: '#1d4ed8' },
  ADMIN: { bg: alpha('#8b5cf6', 0.1), color: '#7c3aed' },
};

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = useMemo(() => {
    const dashPath = getDashboardPath(user?.role);
    return [
      { label: 'Overview', path: dashPath, icon: <DashboardOutlined /> },
      { label: 'Profile', path: '/profile', icon: <PersonOutlined /> },
      { label: 'Settings', path: '/settings', icon: <SettingsOutlined /> },
    ];
  }, [user?.role]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleStyle = ROLE_COLORS[user?.role] ?? ROLE_COLORS.CUSTOMER;
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase();

  const sidebar = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'white',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Brand */}
      <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #2E7D32 0%, #4caf50 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AgricultureOutlined sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color="text.primary" lineHeight={1.1}>
              CropX
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Operations centre
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* User info */}
      <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              fontWeight={700}
              noWrap
              sx={{ maxWidth: 160 }}
            >
              {user?.name || user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={ROLE_LABELS[user?.role] ?? user?.role}
          size="small"
          sx={{
            mt: 1.5,
            height: 22,
            fontSize: '0.7rem',
            fontWeight: 700,
            bgcolor: roleStyle.bg,
            color: roleStyle.color,
            borderRadius: 1,
          }}
        />
      </Box>

      {/* Nav */}
      <Box sx={{ flex: 1, px: 1.5, py: 2, overflowY: 'auto' }}>
        <Typography
          variant="overline"
          color="text.disabled"
          sx={{ px: 1.5, mb: 1, display: 'block' }}
        >
          Navigation
        </Typography>
        <List disablePadding>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                selected={active}
                onClick={() => setMobileOpen(false)}
                sx={{ mb: 0.5 }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? 'primary.main' : 'text.secondary',
                    minWidth: 38,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: active ? 700 : 500,
                    color: active ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Logout */}
      <Box sx={{ px: 2, pb: 3 }}>
        <Divider sx={{ mb: 2 }} />
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          startIcon={<LogoutOutlined />}
          onClick={handleLogout}
          sx={{ justifyContent: 'flex-start', px: 2, borderRadius: 2.5 }}
        >
          Log out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop sidebar */}
      <Box
        component="nav"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Box
          sx={{
            width: DRAWER_WIDTH,
            height: '100vh',
            position: 'sticky',
            top: 0,
          }}
        >
          {sidebar}
        </Box>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        {sidebar}
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 60, sm: 64 } }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1, display: { md: 'none' } }}
              aria-label="Open navigation"
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flex: 1 }} />
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title={user?.name || user?.email}>
                <Avatar sx={{ width: 34, height: 34, fontSize: 13, fontWeight: 800 }}>
                  {initials}
                </Avatar>
              </Tooltip>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ flex: 1, p: { xs: 2.5, md: 4 } }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
