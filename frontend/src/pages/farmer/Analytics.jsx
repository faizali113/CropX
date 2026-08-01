import { Box, Grid, Paper, Stack, Typography, alpha } from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';

const REVENUE = [
  { month: 'Jan', revenue: 48000, expenses: 18000, profit: 30000 },
  { month: 'Feb', revenue: 52000, expenses: 20000, profit: 32000 },
  { month: 'Mar', revenue: 61000, expenses: 22000, profit: 39000 },
  { month: 'Apr', revenue: 45000, expenses: 19000, profit: 26000 },
  { month: 'May', revenue: 70000, expenses: 24000, profit: 46000 },
  { month: 'Jun', revenue: 85000, expenses: 26000, profit: 59000 },
  { month: 'Jul', revenue: 92000, expenses: 28000, profit: 64000 },
];

const YIELD = [
  { crop: 'Wheat', yield: 4200, target: 5000 },
  { crop: 'Rice', yield: 3800, target: 4000 },
  { crop: 'Cotton', yield: 2100, target: 2500 },
  { crop: 'Tomato', yield: 8500, target: 9000 },
  { crop: 'Onion', yield: 6200, target: 6000 },
];

const WATER = [
  { week: 'W1', usage: 1200, optimal: 1000 },
  { week: 'W2', usage: 980, optimal: 1000 },
  { week: 'W3', usage: 1100, optimal: 1000 },
  { week: 'W4', usage: 950, optimal: 1000 },
];

const CROP_DIST = [
  { name: 'Wheat', value: 35, color: '#2E7D32' },
  { name: 'Rice', value: 25, color: '#4caf50' },
  { name: 'Cotton', value: 20, color: '#81c784' },
  { name: 'Vegetables', value: 20, color: '#a5d6a7' },
];

const fmt = n => `₹${(n/1000).toFixed(0)}K`;

export default function Analytics() {
  usePageTitle('Analytics');

  const kpis = [
    { label: 'Total Revenue', value: '₹4.53L', sub: '+18% vs last year', color: '#22c55e' },
    { label: 'Net Profit', value: '₹2.96L', sub: '65% profit margin', color: '#2E7D32' },
    { label: 'Avg Yield/Acre', value: '4.8 Ton', sub: '+12% vs target', color: '#3b82f6' },
    { label: 'Water Efficiency', value: '94%', sub: 'Optimal usage', color: '#06b6d4' },
  ];

  return (
    <DashboardLayout title="Analytics">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Farm Analytics</Typography>
          <Typography variant="body2" color="text.secondary">Comprehensive performance insights for your farm operations</Typography>
        </Box>

        <Grid container spacing={2}>
          {kpis.map((k, i) => (
            <Grid item xs={6} md={3} key={k.label}>
              <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: k.color }}>{k.value}</Typography>
                <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>{k.label}</Typography>
                <Typography variant="caption" color="text.secondary">{k.sub}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Revenue vs Expenses */}
        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Revenue, Expenses & Profit (Monthly)</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={REVENUE} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                {[['rev','#2E7D32'],['exp','#ef4444'],['pft','#3b82f6']].map(([k,c]) => (
                  <linearGradient key={k} id={`a-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000',0.06)} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={fmt} />
              <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2E7D32" strokeWidth={2} fill="url(#a-rev)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#a-exp)" />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#3b82f6" strokeWidth={2} fill="url(#a-pft)" />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        <Grid container spacing={3}>
          {/* Yield vs Target */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Yield vs Target (kg/acre)</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={YIELD} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000',0.06)} />
                  <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="yield" name="Actual" fill="#2E7D32" radius={[4,4,0,0]} />
                  <Bar dataKey="target" name="Target" fill={alpha('#2E7D32',0.2)} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Crop distribution */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Crop Area Distribution</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={CROP_DIST} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {CROP_DIST.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `${v}%`} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Water usage */}
        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Water Consumption vs Optimal (liters/day)</Typography>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={WATER} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000',0.06)} />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="usage" name="Actual Usage" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="optimal" name="Optimal" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}
