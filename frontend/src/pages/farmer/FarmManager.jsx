import { useCallback, useEffect, useState } from 'react';
import {
  Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Grid, IconButton, MenuItem, Paper, Skeleton,
  Stack, TextField, Tooltip, Typography, alpha,
} from '@mui/material';
import { AddCircleOutlineOutlined, AgricultureOutlined, Close, DeleteOutlined, EditOutlined, LocationOnOutlined, WaterDropOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import { parseApiError } from '../../utils/errorParser';
import api from '../../services/api';

const SOIL_TYPES = ['CLAY','SANDY','LOAMY','SILT','PEATY','CHALKY','OTHER'];
const IRRIGATION_TYPES = ['DRIP','SPRINKLER','FLOOD','RAINFED','CANAL','BOREWELL'];
const HEALTH_COLORS = { EXCELLENT: '#22c55e', GOOD: '#4caf50', FAIR: '#f59e0b', POOR: '#ef4444', CRITICAL: '#dc2626' };

function FarmCard({ farm, onEdit, onDelete }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', '&:hover': { boxShadow: '0 8px 32px rgba(46,125,50,0.12)' }, transition: 'all 0.2s' }}>
        <Box sx={{ height: 6, background: 'linear-gradient(90deg,#2E7D32,#4caf50,#81c784)' }} />
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: alpha('#2E7D32', 0.1), color: '#2E7D32', width: 44, height: 44 }}>
                <AgricultureOutlined />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>{farm.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{farm.farm_code}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Edit"><IconButton size="small" onClick={() => onEdit(farm)}><EditOutlined fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => onDelete(farm.id)}><DeleteOutlined fontSize="small" /></IconButton></Tooltip>
            </Stack>
          </Stack>

          <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
            <Grid item xs={6}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha('#2E7D32', 0.05) }}>
                <Typography variant="caption" color="text.secondary">Area</Typography>
                <Typography variant="body2" fontWeight={700}>{farm.area_acres} acres</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha('#2E7D32', 0.05) }}>
                <Typography variant="caption" color="text.secondary">Soil</Typography>
                <Typography variant="body2" fontWeight={700}>{farm.soil_type}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LocationOnOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{[farm.village, farm.taluka, farm.district, farm.state].filter(Boolean).join(', ') || 'Location not set'}</Typography>
              </Stack>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Chip label={farm.irrigation_type} size="small" icon={<WaterDropOutlined sx={{ fontSize: '12px !important' }} />} sx={{ fontSize: '0.68rem', height: 22, bgcolor: alpha('#3b82f6', 0.08), color: '#1d4ed8' }} />
            <Chip label={`${farm.crops_count || 0} crops`} size="small" sx={{ fontSize: '0.68rem', height: 22, bgcolor: alpha('#22c55e', 0.08), color: '#15803d' }} />
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  );
}

function FarmFormDialog({ open, onClose, onSaved, editFarm }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  useEffect(() => { if (editFarm) reset(editFarm); else reset({}); }, [editFarm, reset]);

  const onSubmit = async (data) => {
    try {
      if (editFarm) { await api.patch(`/farms/${editFarm.id}/`, data); toast.success('Farm updated'); }
      else { await api.post('/farms/', data); toast.success('Farm created!'); }
      onSaved(); onClose();
    } catch (e) { toast.error(parseApiError(e, 'Could not save farm')); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography fontWeight={700}>{editFarm ? 'Edit Farm' : 'Add New Farm'}</Typography>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField label="Farm Name *" fullWidth {...register('name', { required: 'Required' })} error={!!errors.name} helperText={errors.name?.message} /></Grid>
            <Grid item xs={6}><TextField label="Area (Acres)" type="number" fullWidth {...register('area_acres')} /></Grid>
            <Grid item xs={6}>
              <TextField select label="Soil Type" fullWidth defaultValue="LOAMY" {...register('soil_type')}>
                {SOIL_TYPES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select label="Irrigation" fullWidth defaultValue="DRIP" {...register('irrigation_type')}>
                {IRRIGATION_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}><TextField label="Water Source" fullWidth {...register('water_source')} /></Grid>
            <Grid item xs={6}><TextField label="Village" fullWidth {...register('village')} /></Grid>
            <Grid item xs={6}><TextField label="Taluka" fullWidth {...register('taluka')} /></Grid>
            <Grid item xs={6}><TextField label="District" fullWidth {...register('district')} /></Grid>
            <Grid item xs={6}><TextField label="State" fullWidth {...register('state')} /></Grid>
            <Grid item xs={6}><TextField label="PIN Code" fullWidth {...register('pin_code')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ borderRadius: 2 }}>
            {isSubmitting ? 'Saving…' : editFarm ? 'Update Farm' : 'Create Farm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function FarmManager() {
  usePageTitle('Farm Manager');
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editFarm, setEditFarm] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get('/farms/'); setFarms(data.results ?? data); }
    catch { setFarms([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this farm?')) return;
    try { await api.delete(`/farms/${id}/`); toast.success('Farm deleted'); fetch(); }
    catch (e) { toast.error(parseApiError(e)); }
  };

  return (
    <DashboardLayout title="Farm Manager">
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight={800}>My Farms</Typography>
            <Typography variant="body2" color="text.secondary">{farms.length} farm{farms.length !== 1 ? 's' : ''} registered</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddCircleOutlineOutlined />} onClick={() => { setEditFarm(null); setDialogOpen(true); }} sx={{ borderRadius: 2.5 }}>
            Add Farm
          </Button>
        </Stack>

        {loading ? (
          <Grid container spacing={2.5}>
            {Array.from({ length: 3 }).map((_, i) => <Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rectangular" height={220} sx={{ borderRadius: 4 }} /></Grid>)}
          </Grid>
        ) : farms.length === 0 ? (
          <Paper sx={{ p: 6, borderRadius: 4, border: '2px dashed', borderColor: alpha('#2E7D32', 0.2), textAlign: 'center' }}>
            <AgricultureOutlined sx={{ fontSize: 56, color: alpha('#2E7D32', 0.3), mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary">No farms yet</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>Add your first farm to start managing your operations</Typography>
            <Button variant="contained" startIcon={<AddCircleOutlineOutlined />} onClick={() => setDialogOpen(true)}>Add First Farm</Button>
          </Paper>
        ) : (
          <Grid container spacing={2.5}>
            {farms.map(f => (
              <Grid item xs={12} sm={6} md={4} key={f.id}>
                <FarmCard farm={f} onEdit={farm => { setEditFarm(farm); setDialogOpen(true); }} onDelete={handleDelete} />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>

      <FarmFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSaved={fetch} editFarm={editFarm} />
    </DashboardLayout>
  );
}
