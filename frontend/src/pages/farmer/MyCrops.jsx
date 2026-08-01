import { useCallback, useEffect, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, MenuItem, Paper, Skeleton, Stack, TextField, Typography, alpha,
} from '@mui/material';
import { AddCircleOutlineOutlined, Close, DeleteOutlined, EditOutlined, GrassOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { parseApiError } from '../../utils/errorParser';
import api from '../../services/api';

const STAGES = ['SOWING','GERMINATION','VEGETATIVE','FLOWERING','FRUITING','MATURITY','HARVESTED'];
const HEALTH = ['EXCELLENT','GOOD','FAIR','POOR','CRITICAL'];
const HEALTH_COLORS = { EXCELLENT: '#22c55e', GOOD: '#4caf50', FAIR: '#f59e0b', POOR: '#ef4444', CRITICAL: '#dc2626' };
const STAGE_COLORS = { SOWING: '#94a3b8', GERMINATION: '#86efac', VEGETATIVE: '#22c55e', FLOWERING: '#f472b6', FRUITING: '#fb923c', MATURITY: '#fbbf24', HARVESTED: '#a3e635' };

function CropCard({ crop, onEdit, onDelete }) {
  const hc = HEALTH_COLORS[crop.health_status] || '#64748b';
  const sc = STAGE_COLORS[crop.current_stage] || '#94a3b8';
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%', '&:hover': { boxShadow: `0 8px 32px ${alpha(hc, 0.15)}` }, transition: 'all 0.2s' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>{crop.name}</Typography>
            {crop.variety && <Typography variant="caption" color="text.secondary">{crop.variety}</Typography>}
          </Box>
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={() => onEdit(crop)}><EditOutlined fontSize="small" /></IconButton>
            <IconButton size="small" color="error" onClick={() => onDelete(crop.id)}><DeleteOutlined fontSize="small" /></IconButton>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap" gap={0.75}>
          <Chip label={crop.current_stage} size="small" sx={{ bgcolor: alpha(sc, 0.15), color: sc, fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
          <Chip label={crop.health_status} size="small" sx={{ bgcolor: alpha(hc, 0.1), color: hc, fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
        </Stack>

        <Grid container spacing={1}>
          {[
            { label: 'Area', val: `${crop.area_acres} ac` },
            { label: 'Est. Yield', val: `${crop.expected_yield_kg} kg` },
            { label: 'Sowing', val: crop.sowing_date || '—' },
            { label: 'Harvest', val: crop.expected_harvest || '—' },
          ].map(r => (
            <Grid item xs={6} key={r.label}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#2E7D32', 0.04) }}>
                <Typography variant="caption" color="text.secondary" display="block">{r.label}</Typography>
                <Typography variant="caption" fontWeight={700}>{r.val}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>📍 {crop.farm_name}</Typography>
      </Paper>
    </motion.div>
  );
}

function CropFormDialog({ open, onClose, onSaved, editCrop, farms }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  useEffect(() => { if (editCrop) reset(editCrop); else reset({}); }, [editCrop, reset]);
  const onSubmit = async (data) => {
    try {
      if (editCrop) { await api.patch(`/crops/${editCrop.id}/`, data); toast.success('Crop updated'); }
      else { await api.post('/crops/', data); toast.success('Crop added!'); }
      onSaved(); onClose();
    } catch (e) { toast.error(parseApiError(e, 'Could not save crop')); }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={700}>{editCrop ? 'Edit Crop' : 'Add Crop'}</Typography>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField select label="Farm *" fullWidth {...register('farm', { required: 'Required' })} error={!!errors.farm} helperText={errors.farm?.message}>
                {farms.map(f => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}><TextField label="Crop Name *" fullWidth {...register('name', { required: 'Required' })} error={!!errors.name} helperText={errors.name?.message} /></Grid>
            <Grid item xs={6}><TextField label="Variety" fullWidth {...register('variety')} /></Grid>
            <Grid item xs={6}>
              <TextField select label="Stage" fullWidth defaultValue="SOWING" {...register('current_stage')}>
                {STAGES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select label="Health" fullWidth defaultValue="GOOD" {...register('health_status')}>
                {HEALTH.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}><TextField label="Area (acres)" type="number" fullWidth {...register('area_acres')} /></Grid>
            <Grid item xs={6}><TextField label="Est. Yield (kg)" type="number" fullWidth {...register('expected_yield_kg')} /></Grid>
            <Grid item xs={6}><TextField label="Sowing Date" type="date" fullWidth InputLabelProps={{ shrink: true }} {...register('sowing_date')} /></Grid>
            <Grid item xs={6}><TextField label="Expected Harvest" type="date" fullWidth InputLabelProps={{ shrink: true }} {...register('expected_harvest')} /></Grid>
            <Grid item xs={12}><TextField label="Notes" multiline rows={2} fullWidth {...register('notes')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ borderRadius: 2 }}>{isSubmitting ? 'Saving…' : editCrop ? 'Update' : 'Add Crop'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function MyCrops() {
  usePageTitle('My Crops');
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCrop, setEditCrop] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, f] = await Promise.all([api.get('/crops/'), api.get('/farms/')]);
      setCrops(c.data.results ?? c.data);
      setFarms(f.data.results ?? f.data);
    } catch { setCrops([]); setFarms([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this crop?')) return;
    try { await api.delete(`/crops/${id}/`); toast.success('Crop deleted'); fetchAll(); }
    catch (e) { toast.error(parseApiError(e)); }
  };

  return (
    <DashboardLayout title="My Crops">
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight={800}>My Crops</Typography>
            <Typography variant="body2" color="text.secondary">{crops.length} crop{crops.length !== 1 ? 's' : ''} active</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddCircleOutlineOutlined />} onClick={() => { setEditCrop(null); setDialogOpen(true); }} sx={{ borderRadius: 2.5 }}>
            Add Crop
          </Button>
        </Stack>

        {loading ? (
          <Grid container spacing={2.5}>{Array.from({ length: 4 }).map((_, i) => <Grid item xs={12} sm={6} md={3} key={i}><Skeleton variant="rectangular" height={240} sx={{ borderRadius: 4 }} /></Grid>)}</Grid>
        ) : crops.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, border: '2px dashed', borderColor: alpha('#2E7D32', 0.2), textAlign: 'center' }}>
            <GrassOutlined sx={{ fontSize: 56, color: alpha('#2E7D32', 0.3), mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary">No crops yet</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>Add your first crop to start tracking growth and health</Typography>
            <Button variant="contained" startIcon={<AddCircleOutlineOutlined />} onClick={() => setDialogOpen(true)}>Add First Crop</Button>
          </Paper>
        ) : (
          <Grid container spacing={2.5}>
            {crops.map(c => <Grid item xs={12} sm={6} md={3} key={c.id}><CropCard crop={c} onEdit={crop => { setEditCrop(crop); setDialogOpen(true); }} onDelete={handleDelete} /></Grid>)}
          </Grid>
        )}
      </Stack>
      <CropFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSaved={fetchAll} editCrop={editCrop} farms={farms} />
    </DashboardLayout>
  );
}
