import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import {
  AdminPanelSettingsOutlined,
  GroupOutlined,
  NotificationsNoneOutlined,
  VerifiedUserOutlined,
} from '@mui/icons-material';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';

/* ─── Stat card ───────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, accent = '#8b5cf6' }) {
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
          bgcolor: alpha(accent, 0.08),
          color: accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={800} sx={{ color: accent }}>
          {value ?? '—'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

/* ─── Empty panel ─────────────────────────────────────────────────────────── */
function EmptyPanel({ icon, title, description }) {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        border: '1.5px dashed',
        borderColor: alpha('#8b5cf6', 0.2),
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        bgcolor: alpha('#8b5cf6', 0.02),
      }}
    >
      <Box sx={{ color: alpha('#8b5cf6', 0.4), fontSize: 0 }}>{icon}</Box>
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260 }}>
        {description}
      </Typography>
    </Paper>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  usePageTitle('Admin Dashboard');
  const { user } = useAuth();
  const PURPLE = '#8b5cf6';

  return (
    <DashboardLayout>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Admin overview, {user?.name || 'admin'} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Platform health, users, and operational metrics.
          </Typography>
        </Box>

        {/* Stat cards */}
        <Grid container spacing={2.5}>
          {[
            { icon: <GroupOutlined />, label: 'Total users', value: null, accent: PURPLE },
            { icon: <VerifiedUserOutlined />, label: 'Verified accounts', value: null, accent: '#2E7D32' },
            { icon: <NotificationsNoneOutlined />, label: 'Active alerts', value: null, accent: '#f59e0b' },
          ].map((s) => (
            <Grid item xs={12} sm={4} key={s.label}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        {/* Empty panels */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <EmptyPanel
              icon={<AdminPanelSettingsOutlined sx={{ fontSize: 48 }} />}
              title="Operations"
              description="Platform activity, user growth, and operational health will be shown here."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <EmptyPanel
              icon={<VerifiedUserOutlined sx={{ fontSize: 48 }} />}
              title="Compliance"
              description="Moderation queues, verification status, and risk signals will appear here."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <EmptyPanel
              icon={<GroupOutlined sx={{ fontSize: 48 }} />}
              title="User insights"
              description="Marketplace patterns and user behaviour analytics will display here."
            />
          </Grid>
        </Grid>
      </Stack>
    </DashboardLayout>
  );
}
