import { useState } from 'react';
import {
  Box, Button, Card, CardContent, Chip, Grid, MenuItem,
  Paper, Stack, TextField, Typography, alpha,
} from '@mui/material';
import { Science, ShoppingCartOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';

// Demo fertilizer database
const FERTILIZER_DB = [
  { id: 1, name: 'NPK 19-19-19', brand: 'Coromandel', category: 'Complex', qty: '50 kg/acre', usage: 'Basal application before sowing', price: 1850, available: true, forDiseases: ['Leaf Blight', 'None'], forStages: ['SOWING', 'VEGETATIVE'], forSoils: ['LOAMY', 'CLAY'], desc: 'Balanced nutrition for all crops. Equal parts Nitrogen, Phosphorus and Potassium.' },
  { id: 2, name: 'Urea 46%', brand: 'NFL', category: 'Nitrogen', qty: '30 kg/acre', usage: 'Top dressing at vegetative stage', price: 266, available: true, forDiseases: [], forStages: ['VEGETATIVE', 'FLOWERING'], forSoils: ['ALL'], desc: 'High nitrogen fertilizer ideal for leafy growth and green color.' },
  { id: 3, name: 'DAP 18-46-0', brand: 'IFFCO', category: 'Phosphatic', qty: '40 kg/acre', usage: 'Basal dose during land preparation', price: 1350, available: true, forDiseases: [], forStages: ['SOWING'], forSoils: ['ALL'], desc: 'Di-Ammonium Phosphate for root development and early growth.' },
  { id: 4, name: 'Neem Cake', brand: 'BioOrganics', category: 'Organic', qty: '200 kg/acre', usage: 'Mix with soil before sowing', price: 420, available: true, forDiseases: ['Leaf Blight', 'Root Rot'], forStages: ['SOWING', 'GERMINATION'], forSoils: ['ALL'], desc: 'Natural pesticide and fertilizer. Repels nematodes and soil-borne pests.' },
  { id: 5, name: 'Potassium Schoenite', brand: 'SQM', category: 'Potassic', qty: '25 kg/acre', usage: 'Foliar spray or soil application', price: 2100, available: false, forDiseases: ['Leaf Blight'], forStages: ['FRUITING', 'MATURITY'], forSoils: ['SANDY', 'LOAMY'], desc: 'Sulfate of potash-magnesia for fruit quality and disease resistance.' },
  { id: 6, name: 'Trichoderma viride', brand: 'BioPlant', category: 'Bio-fertilizer', qty: '4 kg/acre', usage: 'Seed treatment or soil drenching', price: 750, available: true, forDiseases: ['Leaf Blight', 'Root Rot', 'Wilt'], forStages: ['SOWING', 'GERMINATION'], forSoils: ['ALL'], desc: 'Bio-fungicide that colonizes roots and protects against fungal diseases.' },
];

function FertCard({ fert, i }) {
  const catColor = { 'Complex': '#3b82f6', 'Nitrogen': '#22c55e', 'Phosphatic': '#f59e0b', 'Potassic': '#8b5cf6', 'Organic': '#10b981', 'Bio-fertilizer': '#06b6d4' }[fert.category] || '#64748b';
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
      <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%', '&:hover': { boxShadow: `0 8px 32px ${alpha(catColor, 0.15)}` }, transition: 'all 0.2s', opacity: fert.available ? 1 : 0.6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(catColor, 0.12), color: catColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Science fontSize="small" />
          </Box>
          <Stack spacing={0.5} alignItems="flex-end">
            <Chip label={fert.category} size="small" sx={{ bgcolor: alpha(catColor, 0.1), color: catColor, fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
            {!fert.available && <Chip label="Out of stock" size="small" sx={{ bgcolor: alpha('#ef4444', 0.1), color: '#ef4444', fontWeight: 700, fontSize: '0.68rem', height: 22 }} />}
          </Stack>
        </Stack>
        <Typography variant="subtitle1" fontWeight={700}>{fert.name}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>{fert.brand}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.8rem', lineHeight: 1.5 }}>{fert.desc}</Typography>
        <Grid container spacing={1} sx={{ mb: 1.5 }}>
          <Grid item xs={6}><Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#2E7D32', 0.05) }}><Typography variant="caption" color="text.secondary">Qty</Typography><Typography variant="caption" fontWeight={700} display="block">{fert.qty}</Typography></Box></Grid>
          <Grid item xs={6}><Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha('#2E7D32', 0.05) }}><Typography variant="caption" color="text.secondary">Usage</Typography><Typography variant="caption" fontWeight={700} display="block">{fert.usage.split(' ').slice(0, 3).join(' ')}…</Typography></Box></Grid>
        </Grid>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={800} color="primary.main">₹{fert.price}</Typography>
          <Button variant="contained" size="small" startIcon={<ShoppingCartOutlined />} disabled={!fert.available} sx={{ borderRadius: 2, fontSize: '0.72rem' }}>
            Order
          </Button>
        </Stack>
      </Paper>
    </motion.div>
  );
}

export default function FertilizerCenter() {
  usePageTitle('Fertilizer Center');
  const [disease, setDisease] = useState('');
  const [stage, setStage] = useState('');
  const [soil, setSoil] = useState('');

  const filtered = FERTILIZER_DB.filter(f => {
    if (disease && !f.forDiseases.includes(disease) && f.forDiseases.length > 0) return false;
    if (stage && !f.forStages.includes(stage) && f.forStages.length > 0) return false;
    if (soil && !f.forSoils.includes(soil) && !f.forSoils.includes('ALL')) return false;
    return true;
  });

  return (
    <DashboardLayout title="Fertilizer Center">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Fertilizer Center</Typography>
          <Typography variant="body2" color="text.secondary">AI-powered recommendations based on your crop condition</Typography>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>🎯 Filter by your situation</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField select label="Disease Detected" value={disease} onChange={e => setDisease(e.target.value)} fullWidth size="small">
                <MenuItem value="">Any / No Disease</MenuItem>
                {['Leaf Blight','Root Rot','Wilt'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField select label="Crop Stage" value={stage} onChange={e => setStage(e.target.value)} fullWidth size="small">
                <MenuItem value="">Any Stage</MenuItem>
                {['SOWING','GERMINATION','VEGETATIVE','FLOWERING','FRUITING','MATURITY'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField select label="Soil Type" value={soil} onChange={e => setSoil(e.target.value)} fullWidth size="small">
                <MenuItem value="">Any Soil</MenuItem>
                {['CLAY','SANDY','LOAMY','SILT','PEATY'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
          {(disease || stage || soil) && (
            <Box sx={{ mt: 1.5 }}>
              <Chip label={`${filtered.length} fertilizers recommended`} size="small" color="primary" sx={{ fontWeight: 700 }} />
              <Button size="small" onClick={() => { setDisease(''); setStage(''); setSoil(''); }} sx={{ ml: 1, fontSize: '0.75rem' }}>Clear filters</Button>
            </Box>
          )}
        </Paper>

        <Grid container spacing={2.5}>
          {filtered.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={f.id}>
              <FertCard fert={f} i={i} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </DashboardLayout>
  );
}
