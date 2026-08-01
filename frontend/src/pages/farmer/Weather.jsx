import { Box, Chip, Grid, Paper, Stack, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FORECAST = [
  { day: 'Today', icon: '⛅', high: 32, low: 22, rain: 15, wind: 12, humidity: 65, advice: 'Good day for field operations. Complete spraying before noon.' },
  { day: 'Tomorrow', icon: '🌧️', high: 28, low: 20, rain: 75, wind: 18, humidity: 82, advice: 'Rain expected. Delay fertilizer application. Harvest mature crops today.' },
  { day: 'Wednesday', icon: '🌦️', high: 30, low: 21, rain: 40, wind: 14, humidity: 72, advice: 'Patchy showers. Avoid soil tilling.' },
  { day: 'Thursday', icon: '☀️', high: 35, low: 24, rain: 5, wind: 10, humidity: 55, advice: 'Heat wave warning. Increase irrigation by 25%.' },
  { day: 'Friday', icon: '⛅', high: 33, low: 23, rain: 20, wind: 13, humidity: 60, advice: 'Ideal for pest scouting and field monitoring.' },
  { day: 'Saturday', icon: '☀️', high: 36, low: 25, rain: 5, wind: 9, humidity: 50, advice: 'High UV. Avoid outdoor work 11am–3pm.' },
  { day: 'Sunday', icon: '🌩️', high: 27, low: 19, rain: 85, wind: 25, humidity: 90, advice: 'Storm expected. Secure equipment and harvest ripe produce.' },
];

const TEMP_CHART = FORECAST.map(f => ({ day: f.day.slice(0, 3), high: f.high, low: f.low, rain: f.rain }));

export default function Weather() {
  usePageTitle('Weather');
  const today = FORECAST[0];
  return (
    <DashboardLayout title="Weather">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Weather Forecast</Typography>
          <Typography variant="body2" color="text.secondary">7-day agricultural weather forecast with AI farming advice</Typography>
        </Box>

        {/* Hero today card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Paper sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(135deg,#0f4c75 0%,#1b6ca8 60%,#1e88e5 100%)', color: 'white', border: 'none' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: 64, lineHeight: 1 }}>{today.icon}</Typography>
                <Typography variant="h1" fontWeight={900} sx={{ color: 'white', fontSize: { xs: '4rem', md: '5rem' }, lineHeight: 1, mt: 1 }}>{today.high}°C</Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>Today · {today.low}°C low</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={1.5}>
                  {[
                    { label: 'Rain Chance', val: `${today.rain}%`, icon: '🌧️' },
                    { label: 'Wind Speed', val: `${today.wind} km/h`, icon: '💨' },
                    { label: 'Humidity', val: `${today.humidity}%`, icon: '💧' },
                    { label: 'UV Index', val: 6, icon: '☀️' },
                  ].map(w => (
                    <Grid item xs={6} key={w.label}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 3, p: 1.5, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: 22 }}>{w.icon}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{w.label}</Typography>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'white' }}>{w.val}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 3, p: 1.5 }}>
                  <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700 }}>🤖 AI Farming Advice</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 0.5, lineHeight: 1.5 }}>{today.advice}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Temperature chart */}
        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>7-Day Temperature & Rain Trend</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TEMP_CHART} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tempLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.06)} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} fill="url(#tempHigh)" name="High °C" />
              <Area type="monotone" dataKey="low" stroke="#3b82f6" strokeWidth={2} fill="url(#tempLow)" name="Low °C" />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        {/* 7-day grid */}
        <Grid container spacing={2}>
          {FORECAST.map((f, i) => (
            <Grid item xs={6} sm={4} md={12/7 > 1 ? 2 : 12} key={f.day} sx={{ minWidth: 140 }}>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Paper sx={{ p: 2, borderRadius: 3, textAlign: 'center', border: '1px solid', borderColor: i === 0 ? 'primary.main' : 'divider', bgcolor: i === 0 ? alpha('#2E7D32', 0.04) : 'white', '&:hover': { borderColor: 'primary.main' }, transition: 'all 0.15s' }}>
                  <Typography variant="caption" fontWeight={700} color={i === 0 ? 'primary.main' : 'text.secondary'}>{f.day}</Typography>
                  <Typography sx={{ fontSize: 28, my: 0.5 }}>{f.icon}</Typography>
                  <Typography variant="subtitle2" fontWeight={800}>{f.high}°</Typography>
                  <Typography variant="caption" color="text.secondary">{f.low}°</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip label={`${f.rain}% 🌧️`} size="small" sx={{ fontSize: '0.62rem', height: 18, bgcolor: alpha('#3b82f6', 0.08), color: '#1d4ed8' }} />
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Advice cards */}
        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>🤖 AI Farming Recommendations This Week</Typography>
          <Stack spacing={1.5}>
            {FORECAST.map((f, i) => (
              <Box key={f.day} sx={{ display: 'flex', gap: 2, p: 1.5, borderRadius: 2.5, bgcolor: alpha('#2E7D32', 0.03), border: '1px solid', borderColor: alpha('#2E7D32', 0.1) }}>
                <Typography sx={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</Typography>
                <Box>
                  <Typography variant="caption" fontWeight={700} color="primary.main">{f.day}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>{f.advice}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}
