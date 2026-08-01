import { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Chip, Grid, IconButton, Paper,
  Skeleton, Stack, Tooltip, Typography, alpha,
} from '@mui/material';
import {
  AgricultureOutlined, ArrowForward, AutoAwesome,
  CloudOutlined, GrassOutlined, Inbox,
  Refresh, TrendingDown, TrendingFlat, TrendingUp,
  WaterDropOutlined, WbSunnyOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
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

/* ── KPI card ─────────────────────────────────────────────────────────────── */
function KpiCard({ icon, label, value, sub, color, loading, i }) {
  return (
    <motion.div initial="hidden" animate="visible" custom={i} variants={fadeUp} style={{ height: '100%' }}>
      <Paper sx={{
        p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider',
        height: '100%', position: 'relative', overflow: 'hidden',
        '&:hover': { boxShadow: `0 8px 32px ${alpha(color, 0.15)}`, transform: 'translateY(-2px)' },
        transition: 'all 0.2s ease',
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
    </motion.div>
  );
}

/* ── Market crop card ─────────────────────────────────────────────────────── */
function CropPriceCard({ crop, i }) {
  const isUp = crop.trend === 'UP';
  const isDown = crop.trend === 'DOWN';
  const color = isUp ? '#22c55e' : isDown ? '#ef4444' : '#f59e0b';
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : TrendingFlat;
  const sparkData = (crop.sparkline || []).map((v, idx) => ({ v, idx }));

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06, duration: 0.35 }}>
      <Paper sx={{
        p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider',
        '&:hover': { boxShadow: `0 6px 24px ${alpha(color, 0.18)}`, borderColor: alpha(color, 0.4) },
        transition: 'all 0.2s ease', height: '100%',
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="caption" sx={{ fontSize: 22, lineHeight: 1 }}>{crop.emoji}</Typography>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 0.5 }}>{crop.name}</Typography>
            <Typography variant="caption" color="text.secondary">{crop.market_name}</Typography>
          </Box>
          <Chip
            icon={<TrendIcon sx={{ fontSize: '14px !important', color: `${color} !important` }} />}
            label={`${crop.change_percent > 0 ? '+' : ''}${crop.change_percent}%`}
            size="small"
            sx={{ bgcolor: alpha(color, 0.1), color, fontWeight: 700, fontSize: '0.7rem', height: 22 }}
          />
        </Stack>
        <Typography variant="h6" fontWeight={800} sx={{ color, mt: 1 }}>
          ₹{crop.price_per_quintal?.toLocaleString('en-IN')}
        </Typography>
        <Typography variant="caption" color="text.disabled">per quintal · {crop.state}</Typography>
        <Box sx={{ height: 40, mt: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`spark-${crop.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#spark-${crop.id})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </motion.div>
  );
}

/* ── Main page ────────────────────────────────────────────────────────────── */
export default function FarmerDashboard() {
  usePageTitle('Dashboard');
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [market, setMarket] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMarket, setLoadingMarket] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/dashboard/stats/');
      setStats(data);
    } catch {
      setStats({
        farms_count: 0, active_crops: 0, total_orders: 0,
        pending_deliveries: 0, total_revenue: 0, today_income: 0,
        farm_health_score: 0, weather_risk: 'N/A', market_opportunity: 0,
      });
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchMarket = useCallback(async () => {
    setLoadingMarket(true);
    try {
      const { data } = await api.get('/market/highlights/');
      setMarket(data.results || []);
    } catch {
      setMarket([]);
    } finally {
      setLoadingMarket(false);
    }
  }, []);

  useEffect(() => { fetchStats(); fetchMarket(); }, [fetchStats, fetchMarket]);
  // Auto-refresh market highlights every 45 seconds
  useEffect(() => { const t = setInterval(fetchMarket, 45000); return () => clearInterval(t); }, [fetchMarket]);

  const kpis = [
    { icon: <WbSunnyOutlined />, label: "Today's Income", value: fmt(stats?.today_income ?? 0), color: '#f59e0b', sub: 'Updated just now' },
    { icon: <TrendingUp />, label: 'Total Revenue', value: fmt(stats?.total_revenue ?? 0), color: '#22c55e', sub: 'All time' },
    { icon: <GrassOutlined />, label: 'Active Crops', value: stats?.active_crops ?? 0, color: '#2E7D32', sub: `Across ${stats?.farms_count ?? 0} farms` },
    { icon: <Inbox />, label: 'Total Orders', value: stats?.total_orders ?? 0, color: '#3b82f6', sub: `${stats?.pending_deliveries ?? 0} pending` },
    { icon: <AgricultureOutlined />, label: 'Farm Health', value: `${stats?.farm_health_score ?? 0}%`, color: '#22c55e', sub: 'From your farm data' },
    { icon: <CloudOutlined />, label: 'Weather Risk', value: stats?.weather_risk ?? '—', color: '#10b981', sub: 'Connect weather API' },
    { icon: <WaterDropOutlined />, label: 'Market Score', value: `${stats?.market_opportunity ?? 0}`, color: '#8b5cf6', sub: 'Opportunity index' },
    { icon: <AutoAwesome />, label: 'AI Insights', value: '—', color: '#f97316', sub: 'Coming in Step 4' },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <DashboardLayout title={`${greeting}, ${user?.name?.split(' ')[0] || 'Farmer'} 👋`}>
      <Stack spacing={3}>

        {/* KPI grid — all values from /api/dashboard/stats/ */}
        <Grid container spacing={2}>
          {kpis.map((k, i) => (
            <Grid item xs={6} sm={4} md={3} key={k.label}>
              <KpiCard {...k} i={i} loading={loadingStats} />
            </Grid>
          ))}
        </Grid>

        {/* Live Market Highlights — from /api/market/highlights/ */}
        <motion.div initial="hidden" animate="visible" custom={8} variants={fadeUp}>
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 2.5 }} spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: alpha('#2E7D32', 0.1), color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Live Market Highlights</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Randomised demo data · auto-refreshes every 45s
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Refresh now">
                  <IconButton size="small" onClick={fetchMarket} disabled={loadingMarket}>
                    <Refresh fontSize="small" sx={{
                      animation: loadingMarket ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
                    }} />
                  </IconButton>
                </Tooltip>
                <Button component={Link} to="/farmer/crop-prices" endIcon={<ArrowForward />} size="small" variant="outlined" color="primary" sx={{ borderRadius: 2 }}>
                  View market prices
                </Button>
              </Stack>
            </Stack>

            {loadingMarket ? (
              <Grid container spacing={2}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} />
                  </Grid>
                ))}
              </Grid>
            ) : market.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography sx={{ fontSize: 40, mb: 1 }}>📊</Typography>
                <Typography variant="body2" color="text.secondary">Market data unavailable</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {market.map((crop, i) => (
                  <Grid item xs={12} sm={6} md={4} key={crop.id}>
                    <CropPriceCard crop={crop} i={i} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </motion.div>

        {/* Weather & AI Insights — placeholders for Step 2 & 4 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <motion.div initial="hidden" animate="visible" custom={9} variants={fadeUp}>
              <Paper sx={{ p: 3, borderRadius: 4, border: '2px dashed', borderColor: alpha('#3b82f6', 0.25), bgcolor: alpha('#3b82f6', 0.02), height: '100%' }}>
                <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ py: 4, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 48 }}>🌤️</Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="text.secondary">Weather not connected</Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 220 }}>
                    Connect a weather API to see real-time forecasts here.
                  </Typography>
                  <Button component={Link} to="/farmer/weather" size="small" variant="outlined" sx={{ borderRadius: 2, mt: 1 }}>
                    View weather page
                  </Button>
                </Stack>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={8}>
            <motion.div initial="hidden" animate="visible" custom={10} variants={fadeUp}>
              <Paper sx={{ p: 3, borderRadius: 4, border: '2px dashed', borderColor: alpha('#f97316', 0.25), bgcolor: alpha('#f97316', 0.02), height: '100%' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: alpha('#f97316', 0.1), color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AutoAwesome fontSize="small" />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>AI Insights</Typography>
                  <Chip label="Coming in Step 4" size="small" sx={{ bgcolor: alpha('#f97316', 0.1), color: '#f97316', fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
                </Stack>
                <Stack spacing={1.5} alignItems="center" justifyContent="center" sx={{ py: 3, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 48 }}>🤖</Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
                    AI agronomic insights not yet connected
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 380 }}>
                    In Step 4, Gemini / OpenAI will generate personalised insights based on your
                    farm data, weather, and market trends — displayed here in real time.
                  </Typography>
                </Stack>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

      </Stack>
    </DashboardLayout>
  );
}
