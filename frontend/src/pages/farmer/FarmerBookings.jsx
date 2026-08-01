import { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Paper, Select, Skeleton, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, alpha,
} from '@mui/material';
import { BookmarkAdded, CancelOutlined, CheckCircleOutlined, Close } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import api from '../../services/api';

const STATUS_STYLES = {
  PENDING:   { bgcolor: alpha('#f59e0b', 0.1), color: '#b45309', label: '⏳ Pending' },
  BOOKED:    { bgcolor: alpha('#22c55e', 0.12), color: '#15803d', label: '✅ Booked' },
  REJECTED:  { bgcolor: alpha('#ef4444', 0.1), color: '#b91c1c', label: '❌ Rejected' },
  CANCELLED: { bgcolor: alpha('#94a3b8', 0.1), color: '#64748b', label: '🚫 Cancelled' },
  COMPLETED: { bgcolor: alpha('#3b82f6', 0.1), color: '#1d4ed8', label: '🏁 Completed' },
};

function RespondDialog({ open, onClose, booking, onDone }) {
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (open) setNote(''); }, [open]);

  const respond = async (newStatus) => {
    setSubmitting(true);
    try {
      await api.patch(`/bookings/${booking.id}/`, { status: newStatus, farmer_note: note });
      toast.success(newStatus === 'BOOKED' ? '✅ Deal confirmed! Customer has been notified.' : 'Booking declined.');
      onDone();
      onClose();
    } catch { toast.error('Could not update booking status.'); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={700}>Respond to Booking</Typography>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      {booking && (
        <DialogContent>
          <Stack spacing={2}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha('#2E7D32', 0.06) }}>
              <Typography variant="body2" fontWeight={700}>{booking.listing_crop}</Typography>
              <Typography variant="caption" color="text.secondary">
                {booking.quantity_kg} kg · Customer: {booking.customer_name}
              </Typography>
              {booking.message && (
                <Box sx={{ mt: 1, p: 1, borderRadius: 2, bgcolor: alpha('#3b82f6', 0.06) }}>
                  <Typography variant="caption" fontWeight={600} display="block">Customer says:</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>"{booking.message}"</Typography>
                </Box>
              )}
            </Box>
            <TextField label="Your response / note (optional)" multiline rows={2} fullWidth size="small"
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="e.g. Confirmed! I'll have it ready by Tuesday." />
          </Stack>
        </DialogContent>
      )}
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>Later</Button>
        <Button variant="outlined" color="error" disabled={submitting}
          startIcon={<CancelOutlined />} onClick={() => respond('REJECTED')} sx={{ borderRadius: 2 }}>
          Decline
        </Button>
        <Button variant="contained" disabled={submitting}
          startIcon={<BookmarkAdded />} onClick={() => respond('BOOKED')}
          sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#2E7D32,#4caf50)' }}>
          {submitting ? 'Confirming…' : 'Confirm Deal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function FarmerBookings() {
  usePageTitle('Booking Requests');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [responding, setResponding] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== 'ALL' ? { status: filter } : {};
      const { data } = await api.get('/bookings/', { params });
      setBookings(data.results ?? data);
    } catch { setBookings([]); } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetch(); }, [fetch]);

  const pending = bookings.filter(b => b.status === 'PENDING').length;

  return (
    <DashboardLayout title="Booking Requests">
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="h5" fontWeight={800}>Booking Requests</Typography>
              {pending > 0 && (
                <Chip label={`${pending} pending`} size="small"
                  sx={{ bgcolor: alpha('#f59e0b', 0.12), color: '#b45309', fontWeight: 700, height: 22 }} />
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Review customer booking requests. Confirm to lock in the deal.
            </Typography>
          </Box>
          <Select value={filter} onChange={e => setFilter(e.target.value)} size="small" sx={{ borderRadius: 2, minWidth: 160 }}>
            <MenuItem value="ALL">All Status</MenuItem>
            {Object.keys(STATUS_STYLES).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </Stack>

        {loading ? (
          <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 4 }} />
        ) : bookings.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, border: '2px dashed', borderColor: alpha('#2E7D32', 0.2), textAlign: 'center' }}>
            <CheckCircleOutlined sx={{ fontSize: 56, color: alpha('#2E7D32', 0.3), mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary">No booking requests yet</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Customers send booking requests when they want to buy from your listings.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha('#2E7D32', 0.04) }}>
                  {['Customer', 'Crop', 'Qty Requested', 'Price/kg', 'Their Message', 'Status', 'Action'].map(h => (
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
                        <Typography variant="body2" fontWeight={700}>{b.customer_name || '—'}</Typography>
                        <Typography variant="caption" color="text.secondary">{b.customer_email || ''}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{b.listing_crop}</Typography>
                      </TableCell>
                      <TableCell><Typography variant="body2">{b.quantity_kg} kg</Typography></TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="primary.main">
                          ₹{Number(b.listing_price || 0).toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 160, display: 'block' }}>
                          {b.message || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={st.label} size="small"
                          sx={{ bgcolor: st.bgcolor, color: st.color, fontWeight: 800,
                            fontSize: b.status === 'BOOKED' ? '0.78rem' : '0.7rem',
                            height: b.status === 'BOOKED' ? 26 : 22,
                            border: b.status === 'BOOKED' ? `2px solid ${alpha(st.color, 0.4)}` : 'none' }} />
                      </TableCell>
                      <TableCell>
                        {b.status === 'PENDING' ? (
                          <Button size="small" variant="contained" onClick={() => setResponding(b)}
                            sx={{ borderRadius: 2, fontSize: '0.72rem', background: 'linear-gradient(135deg,#2E7D32,#4caf50)' }}>
                            Respond
                          </Button>
                        ) : (
                          <Typography variant="caption" color="text.disabled">
                            {b.farmer_note || '—'}
                          </Typography>
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

      <RespondDialog
        open={Boolean(responding)}
        onClose={() => setResponding(null)}
        booking={responding}
        onDone={fetch}
      />
    </DashboardLayout>
  );
}
