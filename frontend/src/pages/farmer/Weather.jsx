import { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Chip, CircularProgress, Grid, InputAdornment,
  Paper, Skeleton, Stack, TextField, Typography, alpha,
} from '@mui/material';
import { MyLocation, Search } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import api from '../../services/api';

const OW_ICON = code => `https://openweathermap.org/img/wn/${code}@2x.png`;

function WeatherStatBox({ emoji, label, value, dark }) {
  return (
    <Box sx={{ bgcolor: dark ? 'rgba(255,255,255,0.12)' : alpha('#3b82f6', 0.08), borderRadius: 3, p: 1.5, textAlign: 'center' }}>
      <Typography sx={{ fontSize: 22 }}>{emoji}</Typography>
      <Typography variant="caption" sx={{ color: dark ? 'rgba(255,255,255,0.7)' : 'text.secondary', display: 'block' }}>{label}</Typography>
      <Typography variant="subtitle2" fontWeight={700} sx={{ color: dark ? 'white' : 'text.primary' }}>{value}</Typography>
    </Box>
  );
}

export default function Weather() {
  usePageTitle('Weather');
  const [city, setCity] = useState('New Delhi');
  const [inputCity, setInputCity] = useState('New Delhi');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (cityName) => {
    setLoading(true); setError(null);
    try {
      const { data } = await api.get(`/weather/?city=${encodeURIComponent(cityName)}`);
      setWeather(data.current);
      setForecast(data.forecast || []);
    } catch (e) {
      setError(e.response?.data?.detail || 'Could not fetch weather data.');
      setWeather(null); setForecast([]);
    } finally { setLoading(false); }
  }, []);

  // Auto-detect location
  const detectLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { data } = await api.get(`/weather/?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        setWeather(data.current); setForecast(data.forecast || []);
        if (data.current?.city) { setCity(data.current.city); setInputCity(data.current.city); }
      } catch { /* fallback to default */ }
    });
  };

  useEffect(() => { fetchWeather(city); }, [city, fetchWeather]);

  const handleSearch = (e) => { e.preventDefault(); setCity(inputCity.trim() || 'New Delhi'); };

  const chartData = forecast.map(d => ({ day: d.day?.slice(0, 3), high: d.temp_max, low: d.temp_min, rain: d.rain_prob }));

  return (
    <DashboardLayout title="Weather">
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5}>
          <Box>
            <Typography variant="h5" fontWeight={800}>Weather Forecast</Typography>
            <Typography variant="body2" color="text.secondary">Real-time agricultural weather data with AI farming advice</Typography>
          </Box>
          <Stack direction="row" spacing={1} component="form" onSubmit={handleSearch}>
            <TextField size="small" value={inputCity} onChange={e => setInputCity(e.target.value)} placeholder="City name…"
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
              sx={{ width: 200, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <Button type="submit" variant="contained" size="small" sx={{ borderRadius: 2, px: 2 }}>Go</Button>
            <Button variant="outlined" size="small" onClick={detectLocation} startIcon={<MyLocation fontSize="small" />} sx={{ borderRadius: 2 }}>
              Auto
            </Button>
          </Stack>
        </Stack>

        {loading && (
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 4 }} />
            <Grid container spacing={2}>{Array.from({ length: 7 }).map((_, i) => <Grid item xs={6} sm={3} md={12/7 > 1.5 ? 2 : 3} key={i}><Skeleton height={100} sx={{ borderRadius: 3 }} /></Grid>)}</Grid>
          </Stack>
        )}

        {error && !loading && (
          <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center', border: '1px solid', borderColor: alpha('#ef4444', 0.3) }}>
            <Typography sx={{ fontSize: 48, mb: 1 }}>⚠️</Typography>
            <Typography variant="h6" fontWeight={700} color="error">{error}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Try a different city name (e.g. "Mumbai", "Pune", "Hyderabad")</Typography>
          </Paper>
        )}

        {weather && !loading && (
          <>
            {/* Hero current weather */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Paper sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(135deg,#0f4c75 0%,#1b6ca8 50%,#1e88e5 100%)', border: 'none' }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box component="img" src={OW_ICON(weather.icon_code)} sx={{ width: 80, height: 80 }} alt={weather.description} />
                      <Box>
                        <Typography variant="h2" fontWeight={900} sx={{ color: 'white', lineHeight: 1 }}>{weather.temp}°C</Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)' }}>{weather.description}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          📍 {weather.city}{weather.country ? `, ${weather.country}` : ''} · Feels like {weather.feels_like}°C
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={1.5}>
                      <Grid item xs={6}><WeatherStatBox emoji="🌧️" label="Humidity" value={`${weather.humidity}%`} dark /></Grid>
                      <Grid item xs={6}><WeatherStatBox emoji="💨" label="Wind" value={`${weather.wind_speed} km/h`} dark /></Grid>
                      <Grid item xs={6}><WeatherStatBox emoji="👁️" label="Visibility" value={`${weather.visibility} km`} dark /></Grid>
                      <Grid item xs={6}><WeatherStatBox emoji="☁️" label="Cloud Cover" value={`${weather.clouds}%`} dark /></Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>

            {/* Temp + rain chart */}
            {chartData.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>7-Day Temperature & Rain Forecast</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gLow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.06)} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v, n) => [`${v}${n.includes('rain') ? '%' : '°C'}`, n]} />
                    <Area type="monotone" dataKey="high" name="High °C" stroke="#ef4444" strokeWidth={2} fill="url(#gHigh)" />
                    <Area type="monotone" dataKey="low" name="Low °C" stroke="#3b82f6" strokeWidth={2} fill="url(#gLow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            )}

            {/* 7-day forecast cards */}
            {forecast.length > 0 && (
              <Grid container spacing={1.5}>
                {forecast.map((day, i) => (
                  <Grid item xs={6} sm={4} md={12 / forecast.length >= 1.5 ? 2 : 12} sx={{ minWidth: 120 }} key={day.date}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Paper sx={{ p: 1.5, borderRadius: 3, textAlign: 'center', border: '1px solid', borderColor: i === 0 ? 'primary.main' : 'divider', bgcolor: i === 0 ? alpha('#2E7D32', 0.04) : 'background.paper', '&:hover': { borderColor: 'primary.main' }, transition: 'all 0.15s' }}>
                        <Typography variant="caption" fontWeight={700} color={i === 0 ? 'primary.main' : 'text.secondary'} display="block">
                          {i === 0 ? 'Today' : day.day}
                        </Typography>
                        {day.icon_code
                          ? <Box component="img" src={OW_ICON(day.icon_code)} sx={{ width: 44, height: 44, mx: 'auto' }} alt={day.description} />
                          : <Typography sx={{ fontSize: 28, my: 0.5 }}>🌤️</Typography>}
                        <Typography variant="subtitle2" fontWeight={800}>{day.temp_max}°</Typography>
                        <Typography variant="caption" color="text.secondary">{day.temp_min}°</Typography>
                        <Box sx={{ mt: 0.75 }}>
                          <Chip label={`🌧️ ${day.rain_prob}%`} size="small" sx={{ fontSize: '0.6rem', height: 18, bgcolor: alpha('#3b82f6', 0.08), color: '#1d4ed8' }} />
                        </Box>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* AI Farming Advice */}
            {forecast.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>🤖 AI Farming Recommendations</Typography>
                <Stack spacing={1.5}>
                  {forecast.map((day, i) => (
                    <Box key={day.date} sx={{ display: 'flex', gap: 2, p: 1.5, borderRadius: 2.5, bgcolor: alpha('#2E7D32', 0.03), border: '1px solid', borderColor: alpha('#2E7D32', 0.1) }}>
                      <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                        <Typography variant="caption" fontWeight={700} color="primary.main" display="block">{i === 0 ? 'Today' : day.day}</Typography>
                        <Typography variant="caption" color="text.disabled">{day.temp_max}°/{day.temp_min}°</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{day.ai_advice}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}
          </>
        )}
      </Stack>
    </DashboardLayout>
  );
}
