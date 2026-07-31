import {
  Box,
  Grid,
  Paper,
  Stack,
  Switch,
  Typography,
  alpha,
  FormControlLabel,
} from '@mui/material';
import {
  DarkModeOutlined,
  LockOutlined,
  NotificationsOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import DashboardLayout from '../components/common/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';

function SettingRow({ label, description, control }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2,
        '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' },
      }}
    >
      <Box>
        <Typography variant="body2" fontWeight={600}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Box>
      {control}
    </Box>
  );
}

function SettingsSection({ icon, title, children }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2.5,
            bgcolor: alpha('#2E7D32', 0.08),
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
      </Stack>
      {children}
    </Paper>
  );
}

export default function SettingsPage() {
  usePageTitle('Settings');
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        {/* Page title */}
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage preferences for {user?.name || user?.email || 'your account'}.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Notifications */}
          <Grid item xs={12} md={6}>
            <SettingsSection icon={<NotificationsOutlined />} title="Notifications">
              <SettingRow
                label="Email notifications"
                description="Receive updates about orders and activity."
                control={<Switch defaultChecked />}
              />
              <SettingRow
                label="Marketing emails"
                description="News, tips, and platform announcements."
                control={<Switch />}
              />
            </SettingsSection>
          </Grid>

          {/* Security */}
          <Grid item xs={12} md={6}>
            <SettingsSection icon={<LockOutlined />} title="Security">
              <SettingRow
                label="Two-factor authentication"
                description="Add an extra layer of security to your account."
                control={<Switch />}
              />
              <SettingRow
                label="Login alerts"
                description="Get notified when a new device signs in."
                control={<Switch defaultChecked />}
              />
            </SettingsSection>
          </Grid>

          {/* Privacy */}
          <Grid item xs={12} md={6}>
            <SettingsSection icon={<VisibilityOutlined />} title="Privacy">
              <SettingRow
                label="Profile visibility"
                description="Allow other users to find your profile."
                control={<Switch defaultChecked />}
              />
              <SettingRow
                label="Activity status"
                description="Show when you were last active."
                control={<Switch />}
              />
            </SettingsSection>
          </Grid>

          {/* Appearance */}
          <Grid item xs={12} md={6}>
            <SettingsSection icon={<DarkModeOutlined />} title="Appearance">
              <SettingRow
                label="Dark mode"
                description="Switch the platform to a dark colour scheme."
                control={<Switch />}
              />
              <SettingRow
                label="Compact view"
                description="Reduce spacing for a denser layout."
                control={<Switch />}
              />
            </SettingsSection>
          </Grid>
        </Grid>
      </Stack>
    </DashboardLayout>
  );
}
