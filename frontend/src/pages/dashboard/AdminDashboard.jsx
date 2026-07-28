import { Box, Button, Card, CardContent, Grid, Stack, Typography, Paper } from '@mui/material';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const metrics = [
  { label: 'Active users', value: '1.2K' },
  { label: 'Verified accounts', value: '94%' },
  { label: 'Alerts', value: '8' },
];

const cards = [
  { title: 'Operations', description: 'Monitor platform activity, user growth, and operational health.' },
  { title: 'Compliance', description: 'Review moderation, verification, and risk signals in one place.' },
  { title: 'Insights', description: 'Keep an eye on marketplace patterns and business performance.' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAction = (action) => {
    if (action === 'ops') {
      toast.info('Open operations');
      navigate('/profile');
    }
    if (action === 'insights') {
      toast.info('Viewing insights');
      navigate('/settings');
    }
  };

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, md: 3 } }}>
            <Box>
              <Typography variant="h4" fontWeight={800} color="#2E7D32">Admin Dashboard</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>Welcome back, {user?.name || user?.email || 'admin'}.</Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => handleAction('insights')}>Insights</Button>
              <Button variant="contained" onClick={() => handleAction('ops')} sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#256b28' } }}>Operations</Button>
            </Stack>
          </Box>
        </Paper>

        <Grid container spacing={2}>
          {metrics.map((metric) => (
            <Grid item xs={12} sm={4} key={metric.label}>
              <Paper elevation={2} sx={{ borderRadius: 3, p: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={800} color="#2E7D32">{metric.value}</Typography>
                <Typography color="text.secondary">{metric.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          {cards.map((card) => (
            <Grid item xs={12} md={4} key={card.title}>
              <Paper elevation={1} sx={{ borderRadius: 3, p: 2, height: '100%' }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>{card.title}</Typography>
                <Typography color="text.secondary">{card.description}</Typography>
                <Button size="small" sx={{ mt: 2 }} onClick={() => toast.info(`${card.title} clicked`)}>Open</Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </DashboardLayout>
  );
}
