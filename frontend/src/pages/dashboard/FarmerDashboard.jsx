import { useEffect, useState, useCallback } from 'react';
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Grid, IconButton, Paper, Skeleton, Stack, Tooltip, Typography, alpha,
} from '@mui/material';
import {
  AgricultureOutlined, ArrowForward, AutoAwesome,
  CloudOutlined, GrassOutlined, Inbox, Lightbulb,
  Refresh, TrendingDown, TrendingFlat, TrendingUp,
  WaterDropOutlined, WbSunnyOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import {
  Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTip,
} from 'recharts';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import api from '../../services/api';

/* ── helpers ──────────────────────────────────────────────────────────────── */
const fmt = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: i => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }) };

/* ── AI insights (demo) ───────────────────────────────────────────────────── */
const AI_INSIGHTS = [
  { icon: '📈', text: 'Wheat prices are expected to rise 12% this week. Consider delaying sale by 3–4 days.', type: 'market', color: '#22c55e' },
  { icon: '🌧️', text: 'Rain expected tomorrow. Delay fertilizer application by 48 hours.', type: 'weather', color: '#3b82f6' },
  { icon: '💧', text: 'Soil moisture is low in Farm A. Increase irrigation by 20% today.', type: 'soil', color: '#f59e0b' },
  { icon: '🍅', text: 'Tomato demand is increasing in nearby Azadpur Mandi. List now for best price.', type: 'market', color: '#ef4444' },
  { icon: '🌿', text: 'Nitrogen deficiency detected in Crop 3 — Field B. Apply urea @ 50kg/acre.', type: 'crop', color: '#8b5cf6' },
  { icon: '⚡', text: 'Sell onions within 48 hours for maximum profit — prices peak on weekends.', type: 'market', color: '#f59e0b' },
];

/* ── weather demo ─────────────────────────────────────────────────────────── */
const WEATHER = { temp: 28, rain: 25, wind: 14, humidity: 68, uv: 6, condition: 'Partly Cloudy', icon: '⛅', advice: 'Ideal conditions for spraying. Complete field operations before noon.' };

/* ── KPI card ─────────────────────────────────────────────────────────────── */
function KpiCard({ icon, label, value, sub, color, loading, i }) {
  return (
    <motion.div initial="hidden" animate="visible" custom={i} variants={fadeUp} style={{ height: '100%' }}>
      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%', position: 'relative', overflow: 'hidden', '&:hover': { boxShadow: `0 8px 32px ${alpha(color, 0.15)}`, transform: 'translateY(-2px)' }, transition: 'all 0.2s ease' }}>
        <Box sx={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '50%', bgcolor: alpha(color, 0.08), transform: 'translate(20px,-20px)' }} />
        <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: alpha(color, 0.12), color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>{icon}</Box>
        {loading ? <Skeleton width={80} height={32} /> : <Typography variant="h5" fontWeight={800} sx={{ color, lineHeight: 1 }}>{value}</Typography>}
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
      <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', cursor: 'pointer', '&:hover': { boxShadow: `0 6px 24px ${alpha(color, 0.18)}`, borderColor: alpha(color, 0.4) }, transition: 'all 0.2s ease', height: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="caption" sx={{ fontSize: 22, lineHeight: 1 }}>{crop.emoji}</Typography>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 0.5 }}>{crop.name}</Typography>
            <Typography variant="caption" color="text.secondary">{crop.market_name}</Typography>
          </Box>
          <Chip icon={<TrendIcon sx={{ fontSize: '14px !important', color: `${color} !important` }} />}
            label={`${crop.change_percent > 0 ? '+' : ''}${crop.change_percent}%`}
            size="small"
            sx={{ bgcolor: alpha(color, 0.1), color, fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
        </Stack>
        <Typography variant="h6" fontWeight={800} sx={{ color, mt: 1 }}>₹{crop.price_per_quintal?.toLocaleString('en-IN')}</Typography>
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
    } catch { setStats({ farms_count: 0, active_crops: 0, total_orders: 0, pending_deliveries: 0, total_revenue: 0, today_income: 0, farm_health_score: 0, market_opportunity: 0 }); }
    finally { setLoadingStats(false); }
  }, []);

  const fetchMarket = useCallback(async () => {
    setLoadingMarket(true);
    try {
      const { data } = await api.get('/market/highlights/');
      setMarket(data.results || []);
    } catch { setMarket([]); }
    finally { setLoadingMarket(false); }
  }, []);

  useEffect(() => { fetchStats(); fetchMarket(); }, [fetchStats, fetchMarket]);
  useEffect(() => { const t = setInterval(fetchMarket, 45000); return () => clearInterval(t); }, [fetchMarket]);

  const kpis = [
    { icon: <WbSunnyOutlined />, label: "Today's Income", value: fmt(stats?.today_income ?? 0), color: '#f59e0b', sub: 'Updated just now' },
    { icon: <TrendingUp />, label: 'Total Revenue', value: fmt(stats?.total_revenue ?? 0), color: '#22c55e', sub: 'All time' },
    { icon: <GrassOutlined />, label: 'Active Crops', value: stats?.active_crops ?? 0, color: '#2E7D32', sub: `Across ${stats?.farms_count ?? 0} farms` },
    { icon: <Inbox />, label: 'Total Orders', value: stats?.total_orders ?? 0, color: '#3b82f6', sub: `${stats?.pending_deliveries ?? 0} pending` },
    { icon: <AgricultureOutlined />, label: 'Farm Health', value: `${stats?.farm_health_score ?? 0}%`, color: '#22c55e', sub: 'Excellent condition' },
    { icon: <CloudOutlined />, label: 'Weather Risk', value: stats?.weather_risk ?? 'LOW', color: '#10b981', sub: 'Safe to operate' },
    { icon: <WaterDropOutlined />, label: 'Market Score', value: `${stats?.market_opportunity ?? 0}`, color: '#8b5cf6', sub: 'Opportunity index' },
    { icon: <AutoAwesome />, label: 'AI Insights', value: AI_INSIGHTS.length, color: '#f97316', sub: 'Active recommendations' },
  ];

  return (
    <DashboardLayout title={`Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, ${user?.name?.split(' ')[0] || 'Farmer'} 👋`}>
      <Stack spacing={3}>

        {/* KPI grid */}
        <Grid container spacing={2}>
          {kpis.map((k, i) => (
            <Grid item xs={6} sm={4} md={3} key={k.label}>
              <KpiCard {...k} i={i} loading={loadingStats} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Weather Widget */}
          <Grid item xs={12} md={4}>
            <motion.div initial="hidden" animate="visible" custom={8} variants={fadeUp}>
              <Paper sx={{ p: 3, borderRadius: 4, height: '100%', background: 'linear-gradient(135deg,#0f4c75 0%,#1b6ca8 50%,#1e88e5 100%)', color: 'white', border: 'none' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>WEATHER FORECAST</Typography>
                  <Typography sx={{ fontSize: 32 }}>{WEATHER.icon}</Typography>
                </Stack>
                <Typography variant="h2" fontWeight={800} sx={{ color: 'white', mb: 0.25 }}>{WEATHER.temp}°C</Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>{WEATHER.condition}</Typography>
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                  {[
                    { label: 'Rain', value: `${WEATHER.rain}%`, icon: '🌧️' },
                    { label: 'Wind', value: `${WEATHER.wind} km/h`, icon: '💨' },
                    { label: 'Humidity', value: `${WEATHER.humidity}%`, icon: '💧' },
                    { label: 'UV Index', value: WEATHER.uv, icon: '☀️' },
                  ].map(w => (
                    <Grid item xs={6} key={w.label}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 2, p: 1.25, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: 18 }}>{w.icon}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>{w.label}</Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ color: 'white' }}>{w.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 2, p: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Lightbulb sx={{ fontSize: 18, color: '#fbbf24', flexShrink: 0, mt: 0.25 }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{WEATHER.advice}</Typography>
                  </Stack>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* AI Insights */}
          <Grid item xs={12} md={8}>
            <motion.div initial="hidden" animate="visible" custom={9} variants={fadeUp}>
              <Paper sx={{ p: 3, borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: alpha('#f97316', 0.1), color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AutoAwesome fontSize="small" />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>AI Insights</Typography>
                  </Stack>
                  <Chip label="Live" size="small" sx={{ bgcolor: alpha('#22c55e', 0.1), color: '#15803d', fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
                </Stack>
                <Stack spacing={1.5}>
                  {AI_INSIGHTS.map((ins, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, p: 1.5, borderRadius: 2.5, bgcolor: alpha(ins.color, 0.05), border: '1px solid', borderColor: alpha(ins.color, 0.15), '&:hover': { borderColor: alpha(ins.color, 0.35), bgcolor: alpha(ins.color, 0.08) }, transition: 'all 0.15s' }}>
                        <Typography sx={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>{ins.icon}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>{ins.text}</Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Live Market Highlights */}
        <motion.div initial="hidden" animate="visible" custom={10} variants={fadeUp}>
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 2.5 }} spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: alpha('#2E7D32', 0.1), color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Live Market Highlights</Typography>
                  <Typography variant="caption" color="text.secondary">Auto-refreshes every 45s · Demo mode</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Refresh now">
                  <IconButton size="small" onClick={fetchMarket} disabled={loadingMarket}>
                    <Refresh fontSize="small" sx={{ animation: loadingMarket ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
                  </IconButton>
                </Tooltip>
                <Button component={Link} to="/farmer/crop-prices" endIcon={<ArrowForward />} size="small" variant="outlined" color="primary" sx={{ borderRadius: 2 }}>
                  View complete market
                </Button>
              </Stack>
            </Stack>
            {loadingMarket ? (
              <Grid container spacing={2}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} /></Grid>
                ))}
              </Grid>
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

      </Stack>
    </DashboardLayout>
  );
}
