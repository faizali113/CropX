import { Box, Button, Card, CardContent, Grid, Stack, Typography, Paper } from '@mui/material';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const metrics = [
  { label: 'Saved suppliers', value: '12' },
  { label: 'Open orders', value: '5' },
  { label: 'Delivery window', value: '2d' },
];

const cards = [
  { title: 'Marketplace', description: 'Browse produce, compare suppliers, and place high-value orders.' },
  { title: 'Bookings', description: 'Track your pending deliveries and checkout status in one place.' },
  { title: 'Support', description: 'Stay connected with farmers and receive timely updates.' },
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAction = (action) => {
    if (action === 'market') {
      toast.info('Open marketplace');
      navigate('/');
    }
    if (action === 'orders') {
      toast.info('Viewing orders');
      navigate('/profile');
    }
  };

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, md: 3 } }}>
            <Box>
              <Typography variant="h4" fontWeight={800} color="#2E7D32">Customer Dashboard</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>Welcome back, {user?.name || user?.email || 'customer'}.</Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => handleAction('market')}>Marketplace</Button>
              <Button variant="contained" onClick={() => handleAction('orders')} sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#256b28' } }}>My Orders</Button>
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
