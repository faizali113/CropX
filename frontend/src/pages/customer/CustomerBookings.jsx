import { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Chip, MenuItem, Paper, Select, Skeleton,
  Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, alpha,
} from '@mui/material';
import { BookmarkAdd, BookmarkAdded, CancelOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import api from '../../services/api';

const STATUS_STYLES = {
  PENDING:   { bgcolor: alpha('#f59e0b', 0.1), color: '#b45309', label: '⏳ Pending' },
  BOOKED:    { bgcolor: alpha('#22c55e', 0.12), color: '#15803d', label: '✅ Booked!' },
  REJECTED:  { bgcolor: alpha('#ef4444', 0.1), color: '#b91c1c', label: '❌ Rejected' },
  CANCELLED: { bgcolor: alpha('#94a3b8', 0.1), color: '#64748b', label: '🚫 Cancelled' },
  COMPLETED: { bgcolor: alpha('#3b82f6', 0.1), color: '#1d4ed8', label: '🏁 Completed' },
};

export default function CustomerBookings() {
  usePageTitle('My Bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== 'ALL' ? { status: filter } : {};
      const { data } = await api.get('/bookings/', { params });
      setBookings(data.results ?? data);
    } catch { setBookings([]); } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking request?')) return;
    try {
      await api.patch(`/bookings/${id}/`, { status: 'CANCELLED' });
      toast.success('Booking cancelled.');
      fetch();
    } catch { toast.error('Could not cancel this booking.'); }
  };

  return (
    <DashboardLayout title="My Bookings">
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight={800}>My Bookings</Typography>
            <Typography variant="body2" color="text.secondary">
              Track your farm booking requests and deal status.
            </Typography>
          </Box>
          <Select value={filter} onChange={e => setFilter(e.target.value)} size="small" sx={{ borderRadius: 2, minWidth: 160 }}>
            <MenuItem value="ALL">All Status</MenuItem>
            {Object.keys(STATUS_STYLES).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </Stack>

        {loading ? (
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
        ) : bookings.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, border: '2px dashed', borderColor: alpha('#3b82f6', 0.2), textAlign: 'center' }}>
            <BookmarkAdd sx={{ fontSize: 56, color: alpha('#3b82f6', 0.3), mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary">No bookings yet</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Go to Browse Farms and click "Book" on any active listing.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha('#3b82f6', 0.04) }}>
                  {['Crop', 'Farmer', 'Qty', 'Price/kg', 'Your Message', 'Farmer Response', 'Status', 'Action'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((b, i) => {
                  const st = STATUS_STYLES[b.status] ?? STATUS_STYLES.PENDING;
                  return (
                    <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      style={{ display: 'table-row' }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{b.listing_crop}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          #{b.id}
                        </Typography>
                      </TableCell>
                      <TableCell><Typography variant="body2">{b.farmer_name || '—'}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{b.quantity_kg} kg</Typography></TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="primary.main">
                          ₹{Number(b.listing_price).toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 140, display: 'block' }}>
                          {b.message || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 140, display: 'block' }}>
                          {b.farmer_note || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {/* BIG clear BOOKED badge */}
                        <Chip
                          label={st.label}
                          size="small"
                          sx={{
                            bgcolor: st.bgcolor, color: st.color,
                            fontWeight: 800, fontSize: b.status === 'BOOKED' ? '0.8rem' : '0.72rem',
                            height: b.status === 'BOOKED' ? 28 : 22,
                            border: b.status === 'BOOKED' ? `2px solid ${alpha(st.color, 0.4)}` : 'none',
                            px: b.status === 'BOOKED' ? 1 : 0,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {b.status === 'PENDING' && (
                          <Button size="small" variant="outlined" color="error" startIcon={<CancelOutlined fontSize="small" />}
                            onClick={() => handleCancel(b.id)} sx={{ borderRadius: 2, fontSize: '0.72rem' }}>
                            Cancel
                          </Button>
                        )}
                        {b.status === 'BOOKED' && (
                          <Chip icon={<BookmarkAdded />} label="Deal Confirmed!" size="small"
                            sx={{ bgcolor: alpha('#22c55e', 0.1), color: '#15803d', fontWeight: 700, height: 24 }} />
                        )}
                      </TableCell>
                    </motion.tr>
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
