import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import DashboardLayout from '../components/common/DashboardLayout';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e8f5e9' }}>
        <CardContent>
          <Typography variant="h5" fontWeight={800} color="#2E7D32">Profile</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Your profile is backed by the authenticated account data.</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAF5' }}>
                <Typography variant="overline" color="text.secondary">Name</Typography>
                <Typography fontWeight={700}>{user?.name || 'Not provided'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAF5' }}>
                <Typography variant="overline" color="text.secondary">Email</Typography>
                <Typography fontWeight={700}>{user?.email || 'Unavailable'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAF5' }}>
                <Typography variant="overline" color="text.secondary">Role</Typography>
                <Typography fontWeight={700}>{user?.role || 'Customer'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAF5' }}>
                <Typography variant="overline" color="text.secondary">Verified</Typography>
                <Typography fontWeight={700}>{user?.is_verified ? 'Yes' : 'Pending'}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
