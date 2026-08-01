import { useState } from 'react';
import {
  Box, Button, Chip, Divider, Grid, MenuItem, Paper,
  Stack, TextField, Typography, alpha,
} from '@mui/material';
import {
  Assignment, BarChartOutlined, BugReport, CloudDownload,
  PictureAsPdf, TableChart, WbSunnyOutlined,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';

const REPORT_TYPES = [
  { id: 'sales', label: 'Sales Report', icon: <TableChart />, color: '#3b82f6', desc: 'Complete sales history with crop-wise breakdown and customer details.' },
  { id: 'revenue', label: 'Revenue Report', icon: <BarChartOutlined />, color: '#22c55e', desc: 'Monthly and yearly revenue analysis with profit/loss summary.' },
  { id: 'production', label: 'Crop Production', icon: <Assignment />, color: '#2E7D32', desc: 'Yield data, harvest quantities, and farm-wise production statistics.' },
  { id: 'disease', label: 'Disease History', icon: <BugReport />, color: '#ef4444', desc: 'All disease scan records with treatments applied and outcomes.' },
  { id: 'weather', label: 'Weather History', icon: <WbSunnyOutlined />, color: '#f59e0b', desc: 'Historical weather data with farming impact analysis.' },
];

const RECENT = [
  { name: 'Sales Report — June 2026', type: 'PDF', date: '2026-07-01', size: '1.2 MB' },
  { name: 'Revenue Q2 2026', type: 'Excel', date: '2026-07-01', size: '845 KB' },
  { name: 'Crop Production May 2026', type: 'PDF', date: '2026-06-03', size: '980 KB' },
  { name: 'Disease History 2026', type: 'PDF', date: '2026-06-15', size: '432 KB' },
];

export default function Reports() {
  usePageTitle('Reports');
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [format, setFormat] = useState('PDF');
  const [generating, setGenerating] = useState(null);

  const handleGenerate = async (type) => {
    setGenerating(type);
    await new Promise(r => setTimeout(r, 1500));
    setGenerating(null);
    toast.success(`${type} report generated! Download will start shortly.`);
  };

  return (
    <DashboardLayout title="Reports">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Reports</Typography>
          <Typography variant="body2" color="text.secondary">Generate and export detailed farm reports</Typography>
        </Box>

        {/* Settings */}
        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Report Configuration</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField label="From Date" type="date" fullWidth size="small" value={fromDate} onChange={e => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="To Date" type="date" fullWidth size="small" value={toDate} onChange={e => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField select label="Export Format" fullWidth size="small" value={format} onChange={e => setFormat(e.target.value)}>
                <MenuItem value="PDF">PDF Document</MenuItem>
                <MenuItem value="Excel">Excel Spreadsheet</MenuItem>
                <MenuItem value="CSV">CSV File</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Report cards */}
        <Grid container spacing={2.5}>
          {REPORT_TYPES.map(r => (
            <Grid item xs={12} sm={6} md={4} key={r.id}>
              <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%', '&:hover': { boxShadow: `0 8px 32px ${alpha(r.color, 0.12)}` }, transition: 'all 0.2s' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: alpha(r.color, 0.1), color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                  {r.icon}
                </Box>
                <Typography variant="subtitle1" fontWeight={700}>{r.label}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2, lineHeight: 1.5, fontSize: '0.8rem' }}>{r.desc}</Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" size="small" startIcon={format === 'PDF' ? <PictureAsPdf /> : <TableChart />}
                    onClick={() => handleGenerate(r.label)} disabled={generating === r.label}
                    sx={{ borderRadius: 2, flex: 1, fontSize: '0.75rem' }}>
                    {generating === r.label ? 'Generating…' : `Export ${format}`}
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<CloudDownload />} sx={{ borderRadius: 2, fontSize: '0.75rem' }}>
                    Preview
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Recent reports */}
        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recent Reports</Typography>
          <Stack spacing={1}>
            {RECENT.map((r, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2.5, bgcolor: alpha('#2E7D32', 0.03), border: '1px solid', borderColor: 'divider', '&:hover': { borderColor: 'primary.main' }, transition: 'all 0.15s' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  {r.type === 'PDF' ? <PictureAsPdf sx={{ color: '#ef4444', fontSize: 20 }} /> : <TableChart sx={{ color: '#22c55e', fontSize: 20 }} />}
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{r.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.date} · {r.size}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={r.type} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                  <Button size="small" startIcon={<CloudDownload />} sx={{ fontSize: '0.72rem', borderRadius: 2 }}>Download</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}
