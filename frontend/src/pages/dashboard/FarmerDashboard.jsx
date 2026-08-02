import { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogContent, DialogTitle,
  Fab, Grid, IconButton, Paper, Skeleton, Stack,
  Tooltip, Typography, alpha,
} from '@mui/material';
import {
  AgricultureOutlined, ArrowForward, AutoAwesome, Close,
  CloudOutlined, GrassOutlined, Inbox, Refresh,
  TrendingDown, TrendingFlat, TrendingUp,
  WaterDropOutlined, WbSunnyOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import api from '../../services/api';

const fmt = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: i => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }) };

const URGENCY_COLORS = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e' };
const ACTION_LABELS = {
  SELL: '💰 Sell now', HOLD: '⏳ Hold', PLANT: '🌱 Plant',
  IRRIGATE: '💧 Irrigate', HARVEST: '🌾 Harvest',
  INSPECT: '🔬 Inspect', LIST: '📋 List', NEGOTIATE: '🤝 Negotiate',
};
const OW_ICON = code => `https://openweathermap.org/img/wn/${code}@2x.png`;

/* ── KPI card ──────────────────────────────────────────────────────────────── */
function KpiCard({ icon, label, value, sub, color, loading, i }) {
  return (
    <motion.div initial="hidden" animate="visible" custom={i} variants={fadeUp} style={{ height: '100%' }}>
      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%',
        position: 'relative', overflow: 'hidden',
        '&:hover': { boxShadow: `0 8px 32px ${alpha(color, 0.15)}`, transform: 'translateY(-2px)' },
        transition: 'all 0.2s ease' }}>
        <Box sx={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '50%',
          bgcolor: alpha(color, 0.08), transform: 'translate(20px,-20px)' }} />
        <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: alpha(color, 0.12), color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>{icon}</Box>
        {loading ? <Skeleton width={80} height={32} /> :
          <Typography variant="h5" fontWeight={800} sx={{ color, lineHeight: 1 }}>{value}</Typography>}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{label}</Typography>
        {sub && <Typography variant="caption" color="text.disabled">{sub}</Typography>}
      </Paper>
    </motion.div>
  );
}

/* ── Market crop card ──────────────────────────────────────────────────────── */
function CropPriceCard({ crop, i }) {
  const isUp = crop.trend === 'UP', isDown = crop.trend === 'DOWN';
  const color = isUp ? '#22c55e' : isDown ? '#ef4444' : '#f59e0b';
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : TrendingFlat;
  const sparkData = (crop.sparkline || []).map((v, idx) => ({ v, idx }));
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
      <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider',
        '&:hover': { boxShadow: `0 6px 24px ${alpha(color, 0.18)}`, borderColor: alpha(color, 0.4) },
        transition: 'all 0.2s', height: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography sx={{ fontSize: 22, lineHeight: 1 }}>{crop.emoji}</Typography>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 0.5 }}>{crop.name}</Typography>
            <Typography variant="caption" color="text.secondary">{crop.market_name}</Typography>
          </Box>
          <Chip icon={<TrendIcon sx={{ fontSize: '14px !important', color: `${color} !important` }} />}
            label={`${crop.change_percent > 0 ? '+' : ''}${crop.change_percent}%`} size="small"
            sx={{ bgcolor: alpha(color, 0.1), color, fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
        </Stack>
        <Typography variant="h6" fontWeight={800} sx={{ color, mt: 1 }}>₹{crop.price_per_quintal?.toLocaleString('en-IN')}</Typography>
        <Typography variant="caption" color="text.disabled">per quintal · {crop.state}</Typography>
        <Box sx={{ height: 40, mt: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs><linearGradient id={`spark-${crop.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient></defs>
              <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#spark-${crop.id})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </motion.div>
  );
}

/* ── AI Decision Panel Dialog ─────────────────────────────────────────────── */
function AIDecisionPanel({ open, onClose, insights, loading }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 4, border: '1px solid', borderColor: alpha('#f97316', 0.3) } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(135deg,#f97316 0%,#fb923c 100%)', color: 'white', pb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <AutoAwesome sx={{ fontSize: 22 }} />
          <Box>
            <Typography fontWeight={800} variant="h6">AI Farm Advisor</Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>Gemini AI · Personalised for your farm</Typography>
          </Box>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2.5, pb: 3 }}>
        {loading ? (
          <Stack spacing={1.5}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.5, p: 1.5, borderRadius: 2.5, bgcolor: alpha('#f97316', 0.04) }}>
                <Skeleton variant="circular" width={28} height={28} />
                <Box sx={{ flex: 1 }}><Skeleton width="45%" height={16} /><Skeleton width="85%" height={13} sx={{ mt: 0.5 }} /></Box>
              </Box>
            ))}
          </Stack>
        ) : insights.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 48, mb: 1 }}>🤖</Typography>
            <Typography color="text.secondary">No insights yet. Add farms and crops to get started.</Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {insights.map((ins, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <Box sx={{ display: 'flex', gap: 1.5, p: 2, borderRadius: 3,
                  bgcolor: alpha(ins.color || '#f97316', 0.06), border: '1px solid',
                  borderColor: alpha(ins.color || '#f97316', 0.2),
                  '&:hover': { borderColor: alpha(ins.color || '#f97316', 0.45), bgcolor: alpha(ins.color || '#f97316', 0.1) },
                  transition: 'all 0.15s' }}>
                  <Typography sx={{ fontSize: 24, flexShrink: 0, lineHeight: 1.3 }}>{ins.icon}</Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }} flexWrap="wrap">
                      <Typography variant="body2" fontWeight={800}>{ins.title}</Typography>
                      {ins.urgency && (
                        <Chip label={ins.urgency} size="small"
                          sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700,
                            bgcolor: alpha(URGENCY_COLORS[ins.urgency] || '#64748b', 0.12),
                            color: URGENCY_COLORS[ins.urgency] || '#64748b' }} />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 1 }}>{ins.text}</Typography>
                    {ins.action && (
                      <Chip label={ACTION_LABELS[ins.action] || ins.action} size="small"
                        sx={{ bgcolor: alpha(ins.color || '#f97316', 0.12), color: ins.color || '#f97316',
                          fontWeight: 700, height: 22, fontSize: '0.7rem' }} />
                    )}
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ── Main page ─────────────────────────────────────────────────────────────── */
export default function FarmerDashboard() {
  usePageTitle('Dashboard');
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [market, setMarket] = useState([]);
  const [weather, setWeather] = useState(null);
  const [insights, setInsights] = useState([]);
  const [aiOpen, setAiOpen] = useState(false);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMarket, setLoadingMarket] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsFetched, setInsightsFetched] = useState(false);

  /* stats */
  const fetchStats = useCallback(async () => {
    try { const { data } = await api.get('/dashboard/stats/'); setStats(data); }
    catch { setStats({ farms_count:0,active_crops:0,total_orders:0,pending_deliveries:0,total_revenue:0,today_income:0,farm_health_score:0,weather_risk:'—',market_opportunity:0 }); }
    finally { setLoadingStats(false); }
  }, []);

  /* market */
  const fetchMarket = useCallback(async () => {
    setLoadingMarket(true);
    try { const { data } = await api.get('/market/highlights/'); setMarket(data.results || []); }
    catch { setMarket([]); }
    finally { setLoadingMarket(false); }
  }, []);

  /* real weather from OpenWeatherMap */
  const fetchWeather = useCallback(async () => {
    setLoadingWeather(true);
    try {
      const { data } = await api.get('/weather/?city=New Delhi');
      setWeather(data.current);
    } catch { setWeather(null); }
    finally { setLoadingWeather(false); }
  }, []);

  /* AI insights — lazy loaded when panel opens */
  const fetchInsights = useCallback(async () => {
    if (insightsFetched) return;
    setLoadingInsights(true);
    try { const { data } = await api.get('/ai/farmer-insights/'); setInsights(data.insights || []); setInsightsFetched(true); }
    catch { setInsights([]); }
    finally { setLoadingInsights(false); }
  }, [insightsFetched]);

  useEffect(() => { fetchStats(); fetchMarket(); fetchWeather(); }, [fetchStats, fetchMarket, fetchWeather]);
  useEffect(() => { const t = setInterval(fetchMarket, 45000); return () => clearInterval(t); }, [fetchMarket]);

  /* open AI panel: fetch if not yet fetched */
  const handleAiOpen = () => { setAiOpen(true); if (!insightsFetched) fetchInsights(); };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const kpis = [
    { icon: <WbSunnyOutlined />, label:"Today's Income", value: fmt(stats?.today_income ?? 0), color:'#f59e0b', sub:'Updated just now' },
    { icon: <TrendingUp />, label:'Total Revenue', value: fmt(stats?.total_revenue ?? 0), color:'#22c55e', sub:'All time' },
    { icon: <GrassOutlined />, label:'Active Crops', value: stats?.active_crops ?? 0, color:'#2E7D32', sub:`Across ${stats?.farms_count ?? 0} farms` },
    { icon: <Inbox />, label:'Total Orders', value: stats?.total_orders ?? 0, color:'#3b82f6', sub:`${stats?.pending_deliveries ?? 0} pending` },
    { icon: <AgricultureOutlined />, label:'Farm Health', value:`${stats?.farm_health_score ?? 0}%`, color:'#22c55e', sub:'Score from farm data' },
    { icon: <CloudOutlined />, label:'Weather Risk', value: stats?.weather_risk ?? '—', color:'#10b981', sub: weather ? `${weather.temp}°C · ${weather.description}` : 'Loading…' },
    { icon: <WaterDropOutlined />, label:'Market Score', value:`${stats?.market_opportunity ?? 0}`, color:'#8b5cf6', sub:'Opportunity index' },
    { icon: <AutoAwesome />, label:'AI Insights', value: insightsFetched ? insights.length : '?', color:'#f97316', sub:'Click AI button →' },
  ];

  return (
    <DashboardLayout title={`${greeting}, ${user?.name?.split(' ')[0] || 'Farmer'} 👋`}>
      <Stack spacing={3}>

        {/* KPI grid */}
        <Grid container spacing={2}>
          {kpis.map((k, i) => (
            <Grid item xs={6} sm={4} md={3} key={k.label}>
              <KpiCard {...k} i={i} loading={loadingStats} />
            </Grid>
          ))}
        </Grid>

        {/* Weather + AI side by side */}
        <Grid container spacing={3}>

          {/* ── Real Weather Card ──────────────────────────────────────── */}
          <Grid item xs={12} md={4}>
            <motion.div initial="hidden" animate="visible" custom={8} variants={fadeUp}>
              <Paper sx={{ borderRadius: 4, overflow: 'hidden', height: '100%', background:'linear-gradient(135deg,#0f4c75 0%,#1b6ca8 50%,#1e88e5 100%)', border:'none' }}>
                {loadingWeather ? (
                  <Box sx={{ p: 3 }}>
                    <Skeleton variant="text" width="60%" sx={{ bgcolor:'rgba(255,255,255,0.15)' }} />
                    <Skeleton variant="text" width="40%" height={60} sx={{ bgcolor:'rgba(255,255,255,0.15)' }} />
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      {Array.from({length:4}).map((_,i)=><Grid item xs={6} key={i}><Skeleton variant="rectangular" height={56} sx={{ borderRadius:2, bgcolor:'rgba(255,255,255,0.15)' }} /></Grid>)}
                    </Grid>
                  </Box>
                ) : weather ? (
                  <Box sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Box>
                        <Typography variant="overline" sx={{ color:'rgba(255,255,255,0.7)', fontWeight:700, letterSpacing:1.5 }}>LIVE WEATHER</Typography>
                        <Typography variant="caption" sx={{ color:'rgba(255,255,255,0.6)', display:'block' }}>📍 {weather.city}{weather.country ? `, ${weather.country}` : ''}</Typography>
                      </Box>
                      <Box component="img" src={OW_ICON(weather.icon_code)} sx={{ width:52, height:52 }} alt={weather.description} />
                    </Stack>
                    <Typography variant="h2" fontWeight={900} sx={{ color:'white', lineHeight:1 }}>{weather.temp}°C</Typography>
                    <Typography variant="subtitle1" sx={{ color:'rgba(255,255,255,0.85)', mb: 2 }}>{weather.description}</Typography>
                    <Grid container spacing={1.5}>
                      {[{e:'💧',l:'Humidity',v:`${weather.humidity}%`},{e:'💨',l:'Wind',v:`${weather.wind_speed} km/h`},{e:'☁️',l:'Cloud',v:`${weather.clouds}%`},{e:'👁️',l:'Visibility',v:`${weather.visibility}km`}].map(w=>(
                        <Grid item xs={6} key={w.l}>
                          <Box sx={{ bgcolor:'rgba(255,255,255,0.12)', borderRadius:2, p:1.25, textAlign:'center' }}>
                            <Typography sx={{ fontSize:18 }}>{w.e}</Typography>
                            <Typography variant="caption" sx={{ color:'rgba(255,255,255,0.7)', display:'block' }}>{w.l}</Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ color:'white' }}>{w.v}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    <Box sx={{ mt:2, p:1.5, borderRadius:2, bgcolor:'rgba(255,255,255,0.12)' }}>
                      <Typography variant="caption" sx={{ color:'#fbbf24', fontWeight:700 }}>🤖 AI Advice</Typography>
                      <Typography variant="body2" sx={{ color:'rgba(255,255,255,0.9)', mt:0.25, lineHeight:1.5, fontSize:'0.78rem' }}>
                        {weather.humidity > 75 ? 'High humidity — watch for fungal disease. Inspect crops today.' : weather.temp > 35 ? 'Heat alert — increase irrigation frequency now.' : 'Good conditions for field operations. Complete spraying before noon.'}
                      </Typography>
                    </Box>
                    <Button component={Link} to="/farmer/weather" size="small" sx={{ mt:1.5, color:'rgba(255,255,255,0.8)', borderColor:'rgba(255,255,255,0.3)', '&:hover':{color:'white',borderColor:'white'} }} variant="outlined" endIcon={<ArrowForward sx={{fontSize:14}} />}>
                      Full forecast
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ p:3, textAlign:'center' }}>
                    <Typography sx={{ fontSize:36, mb:1 }}>🌤️</Typography>
                    <Typography variant="body2" sx={{ color:'rgba(255,255,255,0.7)' }}>Weather unavailable</Typography>
                    <Button size="small" onClick={fetchWeather} sx={{ color:'white', mt:1 }}>Retry</Button>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* ── AI Insights Preview ────────────────────────────────────── */}
          <Grid item xs={12} md={8}>
            <motion.div initial="hidden" animate="visible" custom={9} variants={fadeUp}>
              <Paper sx={{ p:3, borderRadius:4, border:'1px solid', borderColor:'divider', height:'100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb:2 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width:36, height:36, borderRadius:2.5, background:'linear-gradient(135deg,#f97316,#fb923c)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <AutoAwesome sx={{ color:'white', fontSize:20 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>AI Farm Advisor</Typography>
                      <Typography variant="caption" color="text.secondary">Gemini AI · personalised for your farm data</Typography>
                    </Box>
                  </Stack>
                  <Button variant="contained" size="small" startIcon={<AutoAwesome />} onClick={handleAiOpen}
                    sx={{ borderRadius:2.5, background:'linear-gradient(135deg,#f97316,#fb923c)', boxShadow:`0 4px 14px ${alpha('#f97316',0.4)}`, fontWeight:700, px:2 }}>
                    Ask AI
                  </Button>
                </Stack>

                {/* Show first 3 insights as preview, or skeleton if not loaded */}
                {!insightsFetched ? (
                  <Stack spacing={1}>
                    {[
                      {icon:'📊',text:'Click "Ask AI" to get personalised farming decisions powered by Gemini.'},
                      {icon:'🌾',text:'AI will analyse your crop stages, pending orders, market prices and more.'},
                      {icon:'💡',text:'Get actionable advice: when to sell, what to irrigate, what to plant next.'},
                    ].map((item, i) => (
                      <Box key={i} sx={{ display:'flex', gap:1.5, p:1.75, borderRadius:2.5, bgcolor:alpha('#f97316',0.05), border:'1px solid', borderColor:alpha('#f97316',0.12) }}>
                        <Typography sx={{ fontSize:20, flexShrink:0 }}>{item.icon}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight:1.6 }}>{item.text}</Typography>
                      </Box>
                    ))}
                    <Button fullWidth variant="outlined" onClick={handleAiOpen} startIcon={<AutoAwesome />}
                      sx={{ borderRadius:2.5, mt:0.5, borderColor:alpha('#f97316',0.4), color:'#f97316', fontWeight:700, '&:hover':{borderColor:'#f97316',bgcolor:alpha('#f97316',0.06)} }}>
                      Get My AI Insights Now
                    </Button>
                  </Stack>
                ) : (
                  <Stack spacing={1.25}>
                    {(insights.slice(0, 3)).map((ins, i) => (
                      <Box key={i} sx={{ display:'flex', gap:1.5, p:1.75, borderRadius:2.5,
                        bgcolor:alpha(ins.color||'#f97316',0.05), border:'1px solid', borderColor:alpha(ins.color||'#f97316',0.15),
                        '&:hover':{borderColor:alpha(ins.color||'#f97316',0.4), bgcolor:alpha(ins.color||'#f97316',0.09)}, transition:'all 0.15s' }}>
                        <Typography sx={{ fontSize:20, flexShrink:0 }}>{ins.icon}</Typography>
                        <Box sx={{ flex:1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb:0.25 }}>
                            <Typography variant="body2" fontWeight={700}>{ins.title}</Typography>
                            {ins.urgency && <Chip label={ins.urgency} size="small" sx={{ height:16, fontSize:'0.58rem', fontWeight:700, bgcolor:alpha(URGENCY_COLORS[ins.urgency]||'#64748b',0.12), color:URGENCY_COLORS[ins.urgency]||'#64748b' }} />}
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight:1.55, fontSize:'0.8rem' }}>{ins.text}</Typography>
                        </Box>
                        {ins.action && <Chip label={ACTION_LABELS[ins.action]||ins.action} size="small" sx={{ alignSelf:'flex-start', height:20, fontSize:'0.65rem', fontWeight:700, bgcolor:alpha(ins.color||'#f97316',0.1), color:ins.color||'#f97316', flexShrink:0 }} />}
                      </Box>
                    ))}
                    {insights.length > 3 && (
                      <Button size="small" onClick={handleAiOpen} sx={{ borderRadius:2, color:'#f97316', fontWeight:600 }}>
                        + {insights.length - 3} more insights →
                      </Button>
                    )}
                  </Stack>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Live Market Highlights */}
        <motion.div initial="hidden" animate="visible" custom={10} variants={fadeUp}>
          <Paper sx={{ p:3, borderRadius:4, border:'1px solid', borderColor:'divider' }}>
            <Stack direction={{ xs:'column', sm:'row' }} justifyContent="space-between" alignItems={{ sm:'center' }} sx={{ mb:2.5 }} spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width:32, height:32, borderRadius:2, bgcolor:alpha('#2E7D32',0.1), color:'#2E7D32', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <TrendingUp fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Live Market Highlights</Typography>
                  <Typography variant="caption" color="text.secondary">Auto-refreshes every 45s</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Refresh now">
                  <IconButton size="small" onClick={fetchMarket} disabled={loadingMarket}>
                    <Refresh fontSize="small" sx={{ animation: loadingMarket ? 'spin 1s linear infinite' : 'none', '@keyframes spin':{'0%':{transform:'rotate(0deg)'},'100%':{transform:'rotate(360deg)'}} }} />
                  </IconButton>
                </Tooltip>
                <Button component={Link} to="/farmer/crop-prices" endIcon={<ArrowForward />} size="small" variant="outlined" color="primary" sx={{ borderRadius:2 }}>
                  View market prices
                </Button>
              </Stack>
            </Stack>
            {loadingMarket ? (
              <Grid container spacing={2}>{Array.from({length:6}).map((_,i)=><Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rectangular" height={140} sx={{ borderRadius:3 }} /></Grid>)}</Grid>
            ) : market.length === 0 ? (
              <Box sx={{ py:6, textAlign:'center' }}><Typography sx={{ fontSize:40, mb:1 }}>📊</Typography><Typography variant="body2" color="text.secondary">Market data unavailable</Typography></Box>
            ) : (
              <Grid container spacing={2}>{market.map((crop,i)=><Grid item xs={12} sm={6} md={4} key={crop.id}><CropPriceCard crop={crop} i={i} /></Grid>)}</Grid>
            )}
          </Paper>
        </motion.div>

      </Stack>

      {/* ── Floating AI Button ──────────────────────────────────────────── */}
      <Tooltip title="AI Farm Advisor — get instant decisions" placement="left">
        <Fab onClick={handleAiOpen}
          sx={{
            position:'fixed', bottom:28, right:28, zIndex:1300,
            background:'linear-gradient(135deg,#f97316 0%,#fb923c 100%)',
            color:'white', width:60, height:60,
            boxShadow:'0 8px 32px rgba(249,115,22,0.55)',
            '&:hover':{ background:'linear-gradient(135deg,#ea6c0a,#f97316)', transform:'scale(1.1)', boxShadow:'0 12px 40px rgba(249,115,22,0.65)' },
            transition:'all 0.2s ease',
          }}>
          <AutoAwesome sx={{ fontSize:28 }} />
        </Fab>
      </Tooltip>

      {/* ── AI Decision Panel Dialog ──────────────────────────────────── */}
      <AIDecisionPanel open={aiOpen} onClose={() => setAiOpen(false)} insights={insights} loading={loadingInsights} />

    </DashboardLayout>
  );
}
