import { useCallback, useEffect, useState } from 'react';
import {
  Box, Chip, MenuItem, Paper, Select, Skeleton, Stack,
  Step, StepLabel, Stepper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, alpha,
} from '@mui/material';
import { ShoppingCartOutlined } from '@mui/icons-material';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import api from '../../services/api';

const STATUS_STEPS = ['PENDING', 'ACCEPTED', 'PACKED', 'IN_TRANSIT', 'DELIVERED'];
const STATUS_COLORS = {
  PENDING: '#f59e0b', ACCEPTED: '#3b82f6', PACKED: '#8b5cf6',
  IN_TRANSIT: '#f97316', DELIVERED: '#22c55e', CANCELLED: '#ef4444',
};
const PAY_COLORS = { PENDING: '#f59e0b', PAID: '#22c55e', FAILED: '#ef4444', REFUNDED: '#3b82f6' };
const fmt = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function CustomerOrders() {
  usePageTitle('My Orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== 'ALL' ? { status: filter } : {};
      const { data } = await api.get('/orders/', { params });
      setOrders(data.results ?? data);
    } catch { setOrders([]); } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <DashboardLayout title="My Orders">
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight={800}>My Orders</Typography>
            <Typography variant="body2" color="text.secondary">{orders.length} order{orders.length !== 1 ? 's' : ''}</Typography>
          </Box>
          <Select value={filter} onChange={e => setFilter(e.target.value)} size="small" sx={{ borderRadius: 2, minWidth: 150 }}>
            <MenuItem value="ALL">All Status</MenuItem>
            {[...STATUS_STEPS, 'CANCELLED'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </Stack>

        {loading ? <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} /> : orders.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, border: '2px dashed', borderColor: alpha('#3b82f6', 0.2), textAlign: 'center' }}>
            <ShoppingCartOutlined sx={{ fontSize: 56, color: alpha('#3b82f6', 0.3), mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary">No orders yet</Typography>
            <Typography variant="body2" color="text.disabled">Head to the Marketplace to place your first order.</Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha('#3b82f6', 0.04) }}>
                  {['Order ID', 'Crop', 'Qty', 'Total', 'Farmer', 'Payment', 'Status'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(o => (
                  <TableRow key={o.id} hover onClick={() => setSelected(o === selected ? null : o)}
                    sx={{ cursor: 'pointer', bgcolor: selected?.id === o.id ? alpha('#3b82f6', 0.04) : 'transparent' }}>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#1d4ed8', fontWeight: 700 }}>{o.order_id}</TableCell>
                    <TableCell><Typography variant="body2" fontWeight={600}>{o.crop_name}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{o.quantity_kg} kg</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight={700}>{fmt(o.total_price)}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{o.farmer_name || '—'}</Typography></TableCell>
                    <TableCell><Chip label={o.payment_status} size="small" sx={{ bgcolor: alpha(PAY_COLORS[o.payment_status] || '#64748b', 0.1), color: PAY_COLORS[o.payment_status] || '#64748b', fontWeight: 700, fontSize: '0.68rem', height: 22 }} /></TableCell>
                    <TableCell><Chip label={o.status} size="small" sx={{ bgcolor: alpha(STATUS_COLORS[o.status] || '#64748b', 0.12), color: STATUS_COLORS[o.status] || '#64748b', fontWeight: 700, fontSize: '0.68rem', height: 22 }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {selected && (
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Order Timeline — {selected.order_id}
            </Typography>
            <Stepper alternativeLabel activeStep={STATUS_STEPS.indexOf(selected.status)}>
              {STATUS_STEPS.map(s => (
                <Step key={s}>
                  <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.72rem' } }}>
                    {s.replace('_', ' ')}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {selected.status === 'DELIVERED' && (
              <Box sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: alpha('#22c55e', 0.08), border: '1px solid', borderColor: alpha('#22c55e', 0.25) }}>
                <Typography variant="body2" fontWeight={700} color="#15803d">✅ This order has been delivered!</Typography>
              </Box>
            )}
            {selected.status === 'ACCEPTED' && (
              <Box sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: alpha('#3b82f6', 0.08), border: '1px solid', borderColor: alpha('#3b82f6', 0.25) }}>
                <Typography variant="body2" fontWeight={700} color="#1d4ed8">🤝 Deal confirmed by farmer. Your crop is being prepared.</Typography>
              </Box>
            )}
          </Paper>
        )}
      </Stack>
    </DashboardLayout>
  );
}
