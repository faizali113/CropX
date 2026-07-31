import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import {
  AddShoppingCartOutlined,
  FavoriteBorderOutlined,
  LocalShippingOutlined,
  StorefrontOutlined,
} from '@mui/icons-material';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';

/* ─── Empty-state card ────────────────────────────────────────────────────── */
function EmptyState({ icon, title, description, action }) {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        border: '1.5px dashed',
        borderColor: alpha('#3b82f6', 0.25),
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        bgcolor: alpha('#3b82f6', 0.02),
      }}
    >
      <Box sx={{ color: alpha('#3b82f6', 0.4), fontSize: 0 }}>{icon}</Box>
      <Typography variant="subtitle1" fontWeight={700} color="text.primary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260 }}>
        {description}
      </Typography>
      {action && <Box sx={{ mt: 0.5 }}>{action}</Box>}
    </Paper>
  );
}

/* ─── Stat card ───────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 3,
          bgcolor: alpha('#3b82f6', 0.08),
          color: '#1d4ed8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={800} color="#1d4ed8">
          {value ?? '—'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function CustomerDashboard() {
  usePageTitle('Customer Dashboard');
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Welcome, {user?.name || 'customer'} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your orders and browse the marketplace.
          </Typography>
        </Box>

        {/* Stat cards — placeholders until real data is wired in */}
        <Grid container spacing={2.5}>
          {[
            { icon: <FavoriteBorderOutlined />, label: 'Saved suppliers', value: null },
            { icon: <AddShoppingCartOutlined />, label: 'Open orders', value: null },
            { icon: <LocalShippingOutlined />, label: 'Upcoming deliveries', value: null },
          ].map((s) => (
            <Grid item xs={12} sm={4} key={s.label}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        {/* Empty-state sections */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <EmptyState
              icon={<StorefrontOutlined sx={{ fontSize: 48 }} />}
              title="Marketplace is empty"
              description="Browse verified farmers and place your first order from the marketplace."
              action={
                <Button variant="contained" size="small" startIcon={<StorefrontOutlined />}>
                  Browse marketplace
                </Button>
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <EmptyState
              icon={<AddShoppingCartOutlined sx={{ fontSize: 48 }} />}
              title="No orders yet"
              description="Your pending and completed orders will appear here after your first purchase."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <EmptyState
              icon={<LocalShippingOutlined sx={{ fontSize: 48 }} />}
              title="No deliveries scheduled"
              description="Active deliveries and tracking details will show up here once orders are placed."
            />
          </Grid>
        </Grid>
      </Stack>
    </DashboardLayout>
  );
}
