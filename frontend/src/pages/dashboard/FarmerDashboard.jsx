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
  AddCircleOutlineOutlined,
  AgricultureOutlined,
  BarChartOutlined,
  InboxOutlined,
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
        borderColor: alpha('#2E7D32', 0.2),
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        bgcolor: alpha('#2E7D32', 0.02),
      }}
    >
      <Box sx={{ color: alpha('#2E7D32', 0.4), fontSize: 0 }}>{icon}</Box>
      <Typography variant="subtitle1" fontWeight={700} color="text.primary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260 }}>
        {description}
      </Typography>
      {action && (
        <Box sx={{ mt: 0.5 }}>{action}</Box>
      )}
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
          bgcolor: alpha('#2E7D32', 0.08),
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={800} color="primary.main">
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
export default function FarmerDashboard() {
  usePageTitle('Farmer Dashboard');
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Good day, {user?.name || 'farmer'} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Here's an overview of your farm operations.
          </Typography>
        </Box>

        {/* Stat cards — placeholders until real data is wired in */}
        <Grid container spacing={2.5}>
          {[
            { icon: <AgricultureOutlined />, label: 'Active plots', value: null },
            { icon: <BarChartOutlined />, label: 'Harvest ready', value: null },
            { icon: <InboxOutlined />, label: 'Pending bookings', value: null },
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
              icon={<AgricultureOutlined sx={{ fontSize: 48 }} />}
              title="No plots yet"
              description="Add your first plot to start tracking crop health and field status."
              action={
                <Button variant="contained" size="small" startIcon={<AddCircleOutlineOutlined />}>
                  Add plot
                </Button>
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <EmptyState
              icon={<BarChartOutlined sx={{ fontSize: 48 }} />}
              title="No harvest data"
              description="Your harvest planning and batch logistics will appear here once plots are set up."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <EmptyState
              icon={<InboxOutlined sx={{ fontSize: 48 }} />}
              title="No bookings"
              description="Customer booking requests and order inquiries will show up here."
            />
          </Grid>
        </Grid>
      </Stack>
    </DashboardLayout>
  );
}
