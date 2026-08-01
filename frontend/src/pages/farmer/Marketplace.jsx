import { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, Grid, IconButton, MenuItem, Paper, Skeleton,
  Stack, Switch, TextField, Typography, alpha,
} from '@mui/material';
import { AddCircleOutlineOutlined, CheckCircleOutlined, Close, DeleteOutlined, EditOutlined, Storefront } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { parseApiError } from '../../utils/errorParser';
import api from '../../services/api';

const STATUS_COLORS = { DRAFT: '#94a3b8', ACTIVE: '#22c55e', SOLD: '#3b82f6', EXPIRED: '#ef4444' };

function ListingCard({ listing, onEdit, onDelete, onPublish }) {
  const sc = STATUS_COLORS[listing.status] || '#94a3b8';
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', height: '100%', '&:hover': { boxShadow: '0 8px 32px rgba(46,125,50,0.10)' }, transition: 'all 0.2s' }}>
        <Box sx={{ height: 120, bgcolor: alpha('#2E7D32', 0.06), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 52 }}>🌾</Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>{listing.crop_name}</Typography>
              {listing.variety && <Typography variant="caption" color="text.secondary">{listing.variety}</Typography>}
            </Box>
            <Chip label={listing.status} size="small" sx={{ bgcolor: alpha(sc, 0.12), color: sc, fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
          </Stack>
          <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ mt: 1 }}>₹{listing.price_per_kg}/kg</Typography>
          <Typography variant="caption" color="text.secondary">{listing.quantity_kg} kg available</Typography>
          {listing.is_organic && <Chip label="Organic" size="small" sx={{ ml: 1, bgcolor: alpha('#22c55e', 0.1), color: '#15803d', fontWeight: 700, fontSize: '0.68rem', height: 22 }} />}
          <Stack direction="row" spacing={0.75} sx={{ mt: 1.5 }}>
            {listing.status === 'DRAFT' && <Button size="small" variant="contained" startIcon={<CheckCircleOutlined />} onClick={() => onPublish(listing.id)} sx={{ borderRadius: 2, fontSize: '0.72rem' }}>Publish</Button>}
            <IconButton size="small" onClick={() => onEdit(listing)}><EditOutlined fontSize="small" /></IconButton>
            <IconButton size="small" color="error" onClick={() => onDelete(listing.id)}><DeleteOutlined fontSize="small" /></IconButton>
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  );
}

function ListingFormDialog({ open, onClose, onSaved, editListing }) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();
  useEffect(() => { if (editListing) reset(editListing); else reset({}); }, [editListing, reset]);
  const onSubmit = async (data) => {
    try {
      if (editListing) { await api.patch(`/listings/${editListing.id}/`, data); toast.success('Listing updated'); }
      else { await api.post('/listings/', data); toast.success('Listing created!'); }
      onSaved(); onClose();
    } catch (e) { toast.error(parseApiError(e)); }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={700}>{editListing ? 'Edit Listing' : 'New Listing'}</Typography>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField label="Crop Name *" fullWidth {...register('crop_name', { required: 'Required' })} error={!!errors.crop_name} helperText={errors.crop_name?.message} /></Grid>
            <Grid item xs={6}><TextField label="Variety" fullWidth {...register('variety')} /></Grid>
            <Grid item xs={6}><TextField label="Quantity (kg) *" type="number" fullWidth {...register('quantity_kg', { required: 'Required' })} /></Grid>
            <Grid item xs={6}><TextField label="Price per kg (₹) *" type="number" fullWidth {...register('price_per_kg', { required: 'Required' })} /></Grid>
            <Grid item xs={6}><TextField label="Harvest Date" type="date" fullWidth InputLabelProps={{ shrink: true }} {...register('harvest_date')} /></Grid>
            <Grid item xs={12}><TextField label="Description" multiline rows={3} fullWidth {...register('description')} /></Grid>
            <Grid item xs={12}><FormControlLabel control={<Switch {...register('is_organic')} />} label="Organic Certified" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ borderRadius: 2 }}>{isSubmitting ? 'Saving…' : editListing ? 'Update' : 'Create Listing'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function Marketplace() {
  usePageTitle('Marketplace');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editListing, setEditListing] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get('/listings/'); setListings(data.results ?? data); }
    catch { setListings([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try { await api.delete(`/listings/${id}/`); toast.success('Deleted'); fetch(); }
    catch (e) { toast.error(parseApiError(e)); }
  };

  const handlePublish = async (id) => {
    try { await api.patch(`/listings/${id}/`, { status: 'ACTIVE' }); toast.success('Listing published!'); fetch(); }
    catch (e) { toast.error(parseApiError(e)); }
  };

  return (
    <DashboardLayout title="Marketplace">
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight={800}>My Listings</Typography>
            <Typography variant="body2" color="text.secondary">{listings.length} listing{listings.length !== 1 ? 's' : ''}</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddCircleOutlineOutlined />} onClick={() => { setEditListing(null); setDialogOpen(true); }} sx={{ borderRadius: 2.5 }}>New Listing</Button>
        </Stack>
        {loading ? (
          <Grid container spacing={2.5}>{Array.from({ length: 4 }).map((_, i) => <Grid item xs={12} sm={6} md={3} key={i}><Skeleton variant="rectangular" height={260} sx={{ borderRadius: 4 }} /></Grid>)}</Grid>
        ) : listings.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, border: '2px dashed', borderColor: alpha('#2E7D32', 0.2), textAlign: 'center' }}>
            <Storefront sx={{ fontSize: 56, color: alpha('#2E7D32', 0.3), mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary">No listings yet</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>Create your first crop listing to start selling</Typography>
            <Button variant="contained" startIcon={<AddCircleOutlineOutlined />} onClick={() => setDialogOpen(true)}>Create Listing</Button>
          </Paper>
        ) : (
          <Grid container spacing={2.5}>
            {listings.map(l => <Grid item xs={12} sm={6} md={3} key={l.id}><ListingCard listing={l} onEdit={x => { setEditListing(x); setDialogOpen(true); }} onDelete={handleDelete} onPublish={handlePublish} /></Grid>)}
          </Grid>
        )}
      </Stack>
      <ListingFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSaved={fetch} editListing={editListing} />
    </DashboardLayout>
  );
}
