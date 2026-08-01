import { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Grid, Paper, Skeleton, Stack, Typography, alpha,
} from '@mui/material';
import {
  AddShoppingCartOutlined, AgricultureOutlined,
  CheckCircleOutlined, LocalShippingOutlined,
  ShoppingCartOutlined, TrendingUp,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import api from '../../services/api';

const fmt = n =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: i => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
};

function StatCard({ icon, label, value, sub, color, loading, i, to }) {
  const inner = (
    <Paper sx={{
      p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider',
      height: '100%', position: 'relative', overflow: 'hidden',
      '&:hover': { boxShadow: `0 8px 32px ${alpha(color, 0.15)}`, transform: 'translateY(-2px)' },
      transition: 'all 0.2s ease', cursor: to ? 'pointer' : 'default',
    }}>
      <Box sx={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '50%', bgcolor: alpha(color, 0.08), transform: 'translate(20px,-20px)' }} />
      <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: alpha(color, 0.12), color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
        {icon}
      </Box>
      {loading ? <Skeleton width={80} height={32} /> : (
        <Typography variant="h5" fontWeight={800} sx={{ color, lineHeight: 1 }}>{value}</Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{label}</Typography>
      {sub && <Typography variant="caption" color="text.disabled">{sub}</Typography>}
    </Paper>
  );
  return (
    <motion.div initial="hidden" animate="visible" custom={i} variants={fadeUp} style={{ height: '100%' }}>
      {to ? <Box component={Link} to={to} sx={{ textDecoration: 'none', display: 'block', height: '100%' }}>{inner}</Box> : inner}
    </motion.div>
  );
}

export default function CustomerDashboard() {
  usePageTitle('Dashboard');
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/dashboard/customer-stats/');
      setStats(data);
    } catch {
      setStats({ total_orders: 0, active_orders: 0, delivered_orders: 0, total_spent: 0, available_listings: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const kpis = [
    { icon: <ShoppingCartOutlined />, label: 'Total Orders', value: stats?.total_orders ?? 0, color: '#3b82f6', sub: 'All time', to: '/customer/orders' },
    { icon: <LocalShippingOutlined />, label: 'Active Orders', value: stats?.active_orders ?? 0, color: '#f59e0b', sub: 'In progress', to: '/customer/orders' },
    { icon: <CheckCircleOutlined />, label: 'Delivered', value: stats?.delivered_orders ?? 0, color: '#22c55e', sub: 'Completed', to: '/customer/orders' },
    { icon: <TrendingUp />, label: 'Total Spent', value: fmt(stats?.total_spent ?? 0), color: '#8b5cf6', sub: 'Lifetime value' },
    { icon: <AgricultureOutlined />, label: 'Available Listings', value: stats?.available_listings ?? 0, color: '#2E7D32', sub: 'From farmers', to: '/customer/marketplace' },
  ];

  return (
    <DashboardLayout title={`${greeting}, ${user?.name?.split(' ')[0] || 'there'} 👋`}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {greeting}, {user?.name || 'Customer'} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Here's your activity overview.
          </Typography>
        </Box>

        {/* KPI Cards — all from /api/dashboard/customer-stats/ */}
        <Grid container spacing={2.5}>
          {kpis.map((k, i) => (
            <Grid item xs={6} sm={4} md={12 / kpis.length > 2 ? 2 : 4} key={k.label} sx={{ minWidth: 160 }}>
              <StatCard {...k} i={i} loading={loading} />
            </Grid>
          ))}
        </Grid>

        {/* Quick actions — real navigation links */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <motion.div initial="hidden" animate="visible" custom={5} variants={fadeUp}>
              <Paper sx={{ p: 3, borderRadius: 4, border: '2px dashed', borderColor: alpha('#2E7D32', 0.2), textAlign: 'center', bgcolor: alpha('#2E7D32', 0.02), height: '100%' }}>
                <AgricultureOutlined sx={{ fontSize: 48, color: alpha('#2E7D32', 0.35), mb: 1.5 }} />
                <Typography variant="subtitle1" fontWeight={700}>Browse Farms</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 0.5 }}>
                  Discover farms and available crops from verified farmers.
                </Typography>
                <Button component={Link} to="/customer/farms" variant="contained" size="small" sx={{ borderRadius: 2 }}>
                  View farms
                </Button>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div initial="hidden" animate="visible" custom={6} variants={fadeUp}>
              <Paper sx={{ p: 3, borderRadius: 4, border: '2px dashed', borderColor: alpha('#3b82f6', 0.2), textAlign: 'center', bgcolor: alpha('#3b82f6', 0.02), height: '100%' }}>
                <AddShoppingCartOutlined sx={{ fontSize: 48, color: alpha('#3b82f6', 0.35), mb: 1.5 }} />
                <Typography variant="subtitle1" fontWeight={700}>Marketplace</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 0.5 }}>
                  Browse active crop listings and place orders directly.
                </Typography>
                <Button component={Link} to="/customer/marketplace" variant="contained" size="small" sx={{ borderRadius: 2, bgcolor: '#3b82f6', '&:hover': { bgcolor: '#1d4ed8' } }}>
                  Browse crops
                </Button>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div initial="hidden" animate="visible" custom={7} variants={fadeUp}>
              <Paper sx={{ p: 3, borderRadius: 4, border: '2px dashed', borderColor: alpha('#ef4444', 0.2), textAlign: 'center', bgcolor: alpha('#ef4444', 0.02), height: '100%' }}>
                <Box sx={{ fontSize: 48, mb: 1.5 }}>🔬</Box>
                <Typography variant="subtitle1" fontWeight={700}>Crop Scanner</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 0.5 }}>
                  Upload a crop photo to identify it and get live market price.
                </Typography>
                <Button component={Link} to="/customer/scan" variant="contained" size="small" sx={{ borderRadius: 2, bgcolor: '#ef4444', '&:hover': { bgcolor: '#b91c1c' } }}>
                  Scan a crop
                </Button>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Stack>
    </DashboardLayout>
  );
}
