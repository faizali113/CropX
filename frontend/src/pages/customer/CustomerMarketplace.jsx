import { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, InputAdornment, Paper, Skeleton, Stack,
  TextField, Typography, alpha,
} from '@mui/material';
import { Close, SearchOutlined, ShoppingCartOutlined, Storefront } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { parseApiError } from '../../utils/errorParser';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function ListingCard({ listing, onOrder, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', height: '100%', '&:hover': { boxShadow: '0 8px 32px rgba(46,125,50,0.12)' }, transition: 'all 0.2s' }}>
        <Box sx={{ height: 100, bgcolor: alpha('#2E7D32', 0.06), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 48 }}>🌾</Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>{listing.crop_name}</Typography>
          {listing.variety && <Typography variant="caption" color="text.secondary" display="block">{listing.variety}</Typography>}
          <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ mt: 1 }}>
            ₹{Number(listing.price_per_kg).toLocaleString('en-IN')}/kg
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {Number(listing.quantity_kg).toLocaleString('en-IN')} kg available
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ mt: 1, mb: 1.5 }} flexWrap="wrap" gap={0.5}>
            {listing.is_organic && (
              <Chip label="Organic" size="small" sx={{ bgcolor: alpha('#22c55e', 0.1), color: '#15803d', fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
            )}
            <Chip label={`Farmer: ${listing.farmer_name || 'N/A'}`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
          </Stack>
          <Button fullWidth variant="contained" size="small" startIcon={<ShoppingCartOutlined />}
            onClick={() => onOrder(listing)} sx={{ borderRadius: 2 }}>
            Place Order
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
}

function OrderDialog({ open, onClose, listing, onOrdered }) {
  const { user } = useAuth();
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({ defaultValues: { quantity_kg: 1 } });
  const qty = watch('quantity_kg', 1);
  const total = listing ? (Number(listing.price_per_kg) * Number(qty || 0)) : 0;

  useEffect(() => { if (open) reset({ quantity_kg: 1 }); }, [open, reset]);

  const onSubmit = async (data) => {
    try {
      await api.post('/orders/', {
        listing: listing.id,
        crop_name: listing.crop_name,
        quantity_kg: data.quantity_kg,
        price_per_kg: listing.price_per_kg,
        delivery_address: data.delivery_address || '',
      });
      toast.success('Order placed successfully!');
      onOrdered();
      onClose();
    } catch (e) {
      toast.error(parseApiError(e, 'Could not place order.'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={700}>Place Order</Typography>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      {listing && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={2}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha('#2E7D32', 0.05) }}>
                <Typography variant="body2" fontWeight={700}>{listing.crop_name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ₹{Number(listing.price_per_kg).toLocaleString('en-IN')}/kg from {listing.farmer_name}
                </Typography>
              </Box>
              <TextField
                label="Quantity (kg) *" type="number" fullWidth size="small"
                inputProps={{ min: 0.1, max: Number(listing.quantity_kg), step: 0.1 }}
                {...register('quantity_kg', { required: 'Required', min: { value: 0.1, message: 'Min 0.1 kg' } })}
                error={!!errors.quantity_kg} helperText={errors.quantity_kg?.message}
              />
              <TextField label="Delivery Address" multiline rows={2} fullWidth size="small" {...register('delivery_address')} />
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha('#2E7D32', 0.06) }}>
                <Typography variant="body2" fontWeight={700}>
                  Total: ₹{total.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ borderRadius: 2 }}>
              {isSubmitting ? 'Placing…' : 'Confirm Order'}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}

export default function CustomerMarketplace() {
  usePageTitle('Marketplace');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [orderTarget, setOrderTarget] = useState(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/listings/', { params: { status: 'ACTIVE', ...(search ? { search } : {}) } });
      setListings(data.results ?? data);
    } catch { setListings([]); } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  return (
    <DashboardLayout title="Marketplace">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Crop Marketplace</Typography>
          <Typography variant="body2" color="text.secondary">Browse and order fresh produce directly from verified farmers.</Typography>
        </Box>
        <TextField fullWidth size="small" placeholder="Search crops…"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined fontSize="small" /></InputAdornment> }}
          value={search} onChange={e => setSearch(e.target.value)} sx={{ maxWidth: 420 }} />

        {loading ? (
          <Grid container spacing={2.5}>{Array.from({ length: 6 }).map((_, i) => <Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rectangular" height={240} sx={{ borderRadius: 4 }} /></Grid>)}</Grid>
        ) : listings.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, border: '2px dashed', borderColor: alpha('#2E7D32', 0.2), textAlign: 'center' }}>
            <Storefront sx={{ fontSize: 56, color: alpha('#2E7D32', 0.3), mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary">No listings available</Typography>
            <Typography variant="body2" color="text.disabled">Active listings from farmers will appear here.</Typography>
          </Paper>
        ) : (
          <Grid container spacing={2.5}>
            {listings.map((l, i) => (
              <Grid item xs={12} sm={6} md={4} key={l.id}>
                <ListingCard listing={l} onOrder={setOrderTarget} i={i} />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>

      <OrderDialog open={Boolean(orderTarget)} onClose={() => setOrderTarget(null)} listing={orderTarget} onOrdered={fetchListings} />
    </DashboardLayout>
  );
}
