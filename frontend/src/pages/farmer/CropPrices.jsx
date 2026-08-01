import { useState } from 'react';
import {
  Box, Chip, Grid, InputAdornment, MenuItem, Paper, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, alpha,
} from '@mui/material';
import { Search, TrendingDown, TrendingFlat, TrendingUp } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';

const PRICES = [
  { crop: 'Wheat', emoji: '🌾', market: 'Azadpur Mandi', state: 'Delhi', price: 2280, min: 2100, max: 2450, trend: 'UP', pct: 4.2 },
  { crop: 'Rice (Basmati)', emoji: '🍚', market: 'Karnal', state: 'Haryana', price: 3450, min: 3200, max: 3700, trend: 'UP', pct: 2.8 },
  { crop: 'Cotton', emoji: '🌿', market: 'Akola', state: 'Maharashtra', price: 6820, min: 6600, max: 7100, trend: 'DOWN', pct: -1.5 },
  { crop: 'Tomato', emoji: '🍅', market: 'Koyambedu', state: 'Tamil Nadu', price: 1650, min: 1200, max: 2100, trend: 'UP', pct: 12.4 },
  { crop: 'Onion', emoji: '🧅', market: 'Lasalgaon', state: 'Maharashtra', price: 1180, min: 950, max: 1400, trend: 'STABLE', pct: 0.2 },
  { crop: 'Potato', emoji: '🥔', market: 'Agra', state: 'Uttar Pradesh', price: 920, min: 750, max: 1100, trend: 'DOWN', pct: -3.1 },
  { crop: 'Maize', emoji: '🌽', market: 'Davangere', state: 'Karnataka', price: 1850, min: 1700, max: 2000, trend: 'UP', pct: 1.9 },
  { crop: 'Soybean', emoji: '🫘', market: 'Indore', state: 'Madhya Pradesh', price: 4180, min: 4000, max: 4400, trend: 'STABLE', pct: 0.5 },
  { crop: 'Groundnut', emoji: '🥜', market: 'Junagadh', state: 'Gujarat', price: 5320, min: 5100, max: 5600, trend: 'UP', pct: 3.7 },
  { crop: 'Bajra', emoji: '🌾', market: 'Jodhpur', state: 'Rajasthan', price: 2050, min: 1900, max: 2200, trend: 'STABLE', pct: -0.3 },
];

const WEEKLY = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => ({ d, Wheat: 2200 + i * 15, Tomato: 1500 + Math.sin(i) * 120, Onion: 1100 + i * 10 }));

const STATES = [...new Set(PRICES.map(p => p.state))];

export default function CropPrices() {
  usePageTitle('Crop Prices');
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [trendFilter, setTrendFilter] = useState('');

  const filtered = PRICES.filter(p => {
    if (search && !p.crop.toLowerCase().includes(search.toLowerCase())) return false;
    if (stateFilter && p.state !== stateFilter) return false;
    if (trendFilter && p.trend !== trendFilter) return false;
    return true;
  });

  const TIcon = { UP: TrendingUp, DOWN: TrendingDown, STABLE: TrendingFlat };
  const TColor = { UP: '#22c55e', DOWN: '#ef4444', STABLE: '#f59e0b' };

  return (
    <DashboardLayout title="Crop Prices">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Live Crop Prices</Typography>
          <Typography variant="body2" color="text.secondary">Real-time mandi prices across India · AI-powered predictions</Typography>
        </Box>

        {/* Filters */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth size="small" placeholder="Search crop…"
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
              value={search} onChange={e => setSearch(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField select fullWidth size="small" label="State" value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
              <MenuItem value="">All States</MenuItem>
              {STATES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField select fullWidth size="small" label="Trend" value={trendFilter} onChange={e => setTrendFilter(e.target.value)}>
              <MenuItem value="">All Trends</MenuItem>
              {['UP','DOWN','STABLE'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>

        {/* Price table */}
        <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha('#2E7D32', 0.04) }}>
                {['Crop','Market','State','Price (₹/Qtl)','Min','Max','Trend','Change'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p, i) => {
                const Icon = TIcon[p.trend]; const color = TColor[p.trend];
                return (
                  <TableRow key={p.crop} hover sx={{ '&:hover': { bgcolor: alpha('#2E7D32', 0.02) } }}>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontSize: 20 }}>{p.emoji}</Typography>
                        <Typography variant="body2" fontWeight={600}>{p.crop}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell><Typography variant="body2">{p.market}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{p.state}</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight={800} color="primary.main">₹{p.price.toLocaleString('en-IN')}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">₹{p.min.toLocaleString('en-IN')}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">₹{p.max.toLocaleString('en-IN')}</Typography></TableCell>
                    <TableCell><Stack direction="row" alignItems="center" spacing={0.5}><Icon sx={{ fontSize: 16, color }} /><Typography variant="caption" sx={{ color, fontWeight: 700 }}>{p.trend}</Typography></Stack></TableCell>
                    <TableCell>
                      <Chip label={`${p.pct > 0 ? '+' : ''}${p.pct}%`} size="small" sx={{ bgcolor: alpha(color, 0.1), color, fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Weekly trend chart */}
        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Weekly Price Trend — Key Crops</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={WEEKLY} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                {[['wheat','#2E7D32'],['tomato','#ef4444'],['onion','#f59e0b']].map(([k,c]) => (
                  <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000',0.06)} />
              <XAxis dataKey="d" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v) => [`₹${v}`, '']} />
              <Area type="monotone" dataKey="Wheat" stroke="#2E7D32" strokeWidth={2} fill="url(#g-wheat)" />
              <Area type="monotone" dataKey="Tomato" stroke="#ef4444" strokeWidth={2} fill="url(#g-tomato)" />
              <Area type="monotone" dataKey="Onion" stroke="#f59e0b" strokeWidth={2} fill="url(#g-onion)" />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        {/* AI Prediction banner */}
        <Paper sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(135deg,#1b5e20,#2E7D32)', color: 'white', border: 'none' }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>🤖 AI Market Prediction</Typography>
          <Grid container spacing={2}>
            {[
              { crop: '🌾 Wheat', pred: '↑ +8–12% next week', reason: 'Export demand increasing. Hold stock for 5–7 days.' },
              { crop: '🍅 Tomato', pred: '↑ +15% in 3 days', reason: 'Festival season demand spike. Sell now for best price.' },
              { crop: '🧅 Onion', pred: '→ Stable ±2%', reason: 'Market balanced. No significant movement expected.' },
            ].map(p => (
              <Grid item xs={12} sm={4} key={p.crop}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, p: 2 }}>
                  <Typography fontWeight={700}>{p.crop}</Typography>
                  <Typography variant="subtitle2" sx={{ color: '#fbbf24' }}>{p.pred}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>{p.reason}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}
