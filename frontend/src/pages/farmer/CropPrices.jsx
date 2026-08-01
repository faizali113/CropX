import { useCallback, useEffect, useState } from 'react';
import {
  Box, Chip, Grid, InputAdornment, MenuItem, Paper, Skeleton,
  Stack, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Typography, alpha,
} from '@mui/material';
import { Search, TrendingDown, TrendingFlat, TrendingUp } from '@mui/icons-material';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import api from '../../services/api';

const CROP_EMOJIS = {
  wheat: '🌾', rice: '🍚', cotton: '🌿', tomato: '🍅', onion: '🧅',
  potato: '🥔', maize: '🌽', soybean: '🫘', groundnut: '🥜', bajra: '🌾',
};

const getEmoji = name =>
  CROP_EMOJIS[name?.toLowerCase()] || '🌱';

const TIcon = { UP: TrendingUp, DOWN: TrendingDown, STABLE: TrendingFlat };
const TColor = { UP: '#22c55e', DOWN: '#ef4444', STABLE: '#f59e0b' };

export default function CropPrices() {
  usePageTitle('Crop Prices');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [trendFilter, setTrendFilter] = useState('');

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (stateFilter) params.state = stateFilter;
      if (trendFilter) params.trend = trendFilter;
      if (search) params.search = search;
      const { data } = await api.get('/market/prices/', { params });
      setPrices(data.results ?? data);
    } catch {
      setPrices([]);
    } finally {
      setLoading(false);
    }
  }, [search, stateFilter, trendFilter]);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  // Derive unique states from fetched data
  const states = [...new Set(prices.map(p => p.state).filter(Boolean))];

  return (
    <DashboardLayout title="Crop Prices">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Crop Market Prices</Typography>
          <Typography variant="body2" color="text.secondary">
            Live mandi prices — add records via the admin panel or API to populate this table.
          </Typography>
        </Box>

        {/* Filters */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth size="small" placeholder="Search crop or market…"
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField select fullWidth size="small" label="State" value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
              <MenuItem value="">All States</MenuItem>
              {states.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField select fullWidth size="small" label="Trend" value={trendFilter} onChange={e => setTrendFilter(e.target.value)}>
              <MenuItem value="">All Trends</MenuItem>
              {['UP', 'DOWN', 'STABLE'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>

        {/* Price table */}
        {loading ? (
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
        ) : prices.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, border: '2px dashed', borderColor: alpha('#2E7D32', 0.2), textAlign: 'center' }}>
            <Typography sx={{ fontSize: 48, mb: 2 }}>📊</Typography>
            <Typography variant="h6" fontWeight={700} color="text.secondary">No price data yet</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1, maxWidth: 360, mx: 'auto' }}>
              Market prices will appear here once data is added to the database.
              Use the Django admin panel or the <code>POST /api/market/prices/</code> endpoint to seed prices.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha('#2E7D32', 0.04) }}>
                  {['Crop', 'Market', 'State', 'Price (₹/Qtl)', 'Min', 'Max', 'Trend', 'Change'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {prices.map(p => {
                  const Icon = TIcon[p.trend] ?? TrendingFlat;
                  const color = TColor[p.trend] ?? '#64748b';
                  return (
                    <TableRow key={p.id} hover sx={{ '&:hover': { bgcolor: alpha('#2E7D32', 0.02) } }}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography sx={{ fontSize: 20 }}>{getEmoji(p.crop_name)}</Typography>
                          <Typography variant="body2" fontWeight={600}>{p.crop_name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell><Typography variant="body2">{p.market_name}</Typography></TableCell>
                      <TableCell><Typography variant="caption" color="text.secondary">{p.state}</Typography></TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={800} color="primary.main">
                          ₹{Number(p.price_per_quintal).toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          ₹{Number(p.min_price).toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          ₹{Number(p.max_price).toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Icon sx={{ fontSize: 16, color }} />
                          <Typography variant="caption" sx={{ color, fontWeight: 700 }}>{p.trend}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${p.change_percent > 0 ? '+' : ''}${p.change_percent}%`}
                          size="small"
                          sx={{ bgcolor: alpha(color, 0.1), color, fontWeight: 700, fontSize: '0.68rem', height: 22 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </DashboardLayout>
  );
}
