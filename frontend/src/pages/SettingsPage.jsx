import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import DashboardLayout from '../components/common/DashboardLayout';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e8f5e9' }}>
        <CardContent>
          <Typography variant="h5" fontWeight={800} color="#2E7D32">Settings</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Manage the preferences for {user?.name || user?.email || 'your account'}.</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAF5' }}>Notifications</Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAF5' }}>Security preferences</Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAF5' }}>Account visibility</Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAF5' }}>Theme preference</Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
