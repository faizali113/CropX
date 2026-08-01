import { useCallback, useEffect, useState } from 'react';
import {
  Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, InputAdornment, Paper, Skeleton, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, alpha,
} from '@mui/material';
import {
  AgricultureOutlined, Close, LocationOnOutlined,
  MessageOutlined, SearchOutlined, BookmarkAdd,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { parseApiError } from '../../utils/errorParser';
import api from '../../services/api';

/* ── Booking request dialog ─────────────────────────────────────────────── */
function BookingDialog({ open, onClose, listing, onBooked }) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({ defaultValues: { quantity_kg: 1 } });
  const qty = watch('quantity_kg', 1);
  const total = listing ? (Number(listing.price_per_kg) * Number(qty || 0)) : 0;

  useEffect(() => { if (open) reset({ quantity_kg: 1 }); }, [open, reset]);

  const onSubmit = async (data) => {
    try {
      await api.post('/bookings/', {
        listing: listing.id,
        quantity_kg: data.quantity_kg,
        message: data.message || '',
      });
      toast.success('Booking request sent to farmer!');
      onBooked();
      onClose();
    } catch (e) {
      toast.error(parseApiError(e, 'Could not send booking request.'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={700}>Request a Booking</Typography>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      {listing && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={2}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha('#2E7D32', 0.06) }}>
                <Typography variant="body2" fontWeight={700}>{listing.crop_name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ₹{Number(listing.price_per_kg).toLocaleString('en-IN')}/kg · Farmer: {listing.farmer_name}
                </Typography>
              </Box>
              <TextField label="Quantity you need (kg) *" type="number" fullWidth size="small"
                inputProps={{ min: 0.1, max: Number(listing.quantity_kg), step: 0.1 }}
                {...register('quantity_kg', { required: 'Required', min: { value: 0.1, message: 'Min 0.1 kg' } })}
                error={!!errors.quantity_kg} helperText={errors.quantity_kg?.message} />
              <TextField label="Message to farmer (optional)" multiline rows={3} fullWidth size="small"
                placeholder="e.g. I need fresh tomatoes delivered by Friday…"
                {...register('message')} />
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha('#3b82f6', 0.08), border: '1px solid', borderColor: alpha('#3b82f6', 0.2) }}>
                <Typography variant="body2">
                  <strong>Estimated total:</strong> ₹{total.toLocaleString('en-IN')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  The farmer will confirm or negotiate before the deal is finalised.
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={<BookmarkAdd />} sx={{ borderRadius: 2 }}>
              {isSubmitting ? 'Sending…' : 'Send Booking Request'}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export default function BrowseFarms() {
  usePageTitle('Browse Farms');
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bookTarget, setBookTarget] = useState(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = { status: 'ACTIVE', ...(search ? { search } : {}) };
      const { data } = await api.get('/listings/', { params });
      setListings(data.results ?? data);
    } catch { setListings([]); } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  return (
    <DashboardLayout title="Browse Farms">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Farm Listings</Typography>
          <Typography variant="body2" color="text.secondary">
            All active crop listings from verified farmers. Message to negotiate or send a booking request.
          </Typography>
        </Box>

        <TextField size="small" placeholder="Search crop name, variety…"
          value={search} onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined fontSize="small" /></InputAdornment> }}
          sx={{ maxWidth: 420 }} />

        {loading ? (
          <Skeleton variant="rectangular" height={340} sx={{ borderRadius: 4 }} />
        ) : listings.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, border: '2px dashed', borderColor: alpha('#2E7D32', 0.2), textAlign: 'center' }}>
            <AgricultureOutlined sx={{ fontSize: 56, color: alpha('#2E7D32', 0.3), mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary">No active listings yet</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Farmers will publish their listings here. Check back soon.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha('#2E7D32', 0.04) }}>
                  {['Farmer', 'Crop', 'Available Qty', 'Price/kg', 'Organic', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {listings.map((l, i) => (
                  <motion.tr key={l.id} component={TableRow} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    hover sx={{ '&:hover': { bgcolor: alpha('#2E7D32', 0.02) }, display: 'table-row' }}>
                    {/* Farmer */}
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 34, height: 34, fontSize: 12, fontWeight: 800 }}>
                          {(l.farmer_name || '?')[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{l.farmer_name || 'Farmer'}</Typography>
                          <Typography variant="caption" color="text.secondary">{l.farmer_email || ''}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    {/* Crop */}
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{l.crop_name}</Typography>
                      {l.variety && <Typography variant="caption" color="text.secondary">{l.variety}</Typography>}
                    </TableCell>
                    {/* Qty */}
                    <TableCell>
                      <Typography variant="body2">{Number(l.quantity_kg).toLocaleString('en-IN')} kg</Typography>
                    </TableCell>
                    {/* Price */}
                    <TableCell>
                      <Typography variant="body2" fontWeight={800} color="primary.main">
                        ₹{Number(l.price_per_kg).toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>
                    {/* Organic */}
                    <TableCell>
                      {l.is_organic
                        ? <Chip label="Organic ✓" size="small" sx={{ bgcolor: alpha('#22c55e', 0.1), color: '#15803d', fontWeight: 700, height: 22, fontSize: '0.68rem' }} />
                        : <Typography variant="caption" color="text.disabled">—</Typography>}
                    </TableCell>
                    {/* Actions */}
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined" startIcon={<MessageOutlined fontSize="small" />}
                          component={Link} to="/customer/messages"
                          sx={{ borderRadius: 2, fontSize: '0.72rem', py: 0.5 }}>
                          Message
                        </Button>
                        <Button size="small" variant="contained" startIcon={<BookmarkAdd fontSize="small" />}
                          onClick={() => setBookTarget(l)}
                          sx={{ borderRadius: 2, fontSize: '0.72rem', py: 0.5 }}>
                          Book
                        </Button>
                      </Stack>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center' }}>
          {listings.length} active listing{listings.length !== 1 ? 's' : ''} · Refresh to see updates
        </Typography>
      </Stack>

      <BookingDialog
        open={Boolean(bookTarget)}
        onClose={() => setBookTarget(null)}
        listing={bookTarget}
        onBooked={fetchListings}
      />
    </DashboardLayout>
  );
}
