import {
  Avatar,
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import {
  CalendarTodayOutlined,
  EmailOutlined,
  PersonOutlined,
  VerifiedOutlined,
  WorkOutlined,
} from '@mui/icons-material';
import DashboardLayout from '../components/common/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { ROLE_LABELS } from '../constants/roles';
import { formatDate } from '../utils/formatDate';

const ROLE_COLORS = {
  FARMER: { bg: alpha('#22c55e', 0.1), color: '#15803d' },
  CUSTOMER: { bg: alpha('#3b82f6', 0.1), color: '#1d4ed8' },
  ADMIN: { bg: alpha('#8b5cf6', 0.1), color: '#7c3aed' },
};

function InfoRow({ icon, label, value }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderRadius: 3,
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ color: 'primary.main', flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="overline" color="text.disabled" sx={{ lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {value || '—'}
        </Typography>
      </Box>
    </Box>
  );
}

export default function ProfilePage() {
  usePageTitle('Profile');
  const { user } = useAuth();
  const roleStyle = ROLE_COLORS[user?.role] ?? ROLE_COLORS.CUSTOMER;
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase();

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        {/* Page title */}
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Profile
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Your account information.
          </Typography>
        </Box>

        {/* Profile header card */}
        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ sm: 'center' }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                fontSize: 24,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={800}>
                {user?.name || 'Unnamed user'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" gap={1}>
                <Chip
                  label={ROLE_LABELS[user?.role] ?? user?.role}
                  size="small"
                  sx={{ bgcolor: roleStyle.bg, color: roleStyle.color, fontWeight: 700, borderRadius: 1 }}
                />
                <Chip
                  icon={<VerifiedOutlined sx={{ fontSize: '14px !important' }} />}
                  label={user?.is_verified ? 'Verified' : 'Unverified'}
                  size="small"
                  sx={{
                    bgcolor: user?.is_verified ? alpha('#22c55e', 0.1) : alpha('#f59e0b', 0.1),
                    color: user?.is_verified ? '#15803d' : '#b45309',
                    fontWeight: 700,
                    borderRadius: 1,
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Detail fields */}
        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
            Account details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<PersonOutlined />} label="Full name" value={user?.name} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<EmailOutlined />} label="Email address" value={user?.email} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow icon={<WorkOutlined />} label="Role" value={ROLE_LABELS[user?.role] ?? user?.role} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InfoRow
                icon={<CalendarTodayOutlined />}
                label="Member since"
                value={formatDate(user?.created_at)}
              />
            </Grid>
          </Grid>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}
