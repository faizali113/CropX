import { useRef, useState } from 'react';
import {
  Box, Button, Chip, CircularProgress, Divider, Grid,
  LinearProgress, Paper, Stack, Typography, alpha,
} from '@mui/material';
import {
  AutoAwesome, CloudUploadOutlined, RestartAlt,
  TrendingDown, TrendingFlat, TrendingUp,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';
import api from '../../services/api';

const HEALTH_COLORS = {
  Healthy: '#22c55e', Stressed: '#f59e0b',
  Diseased: '#ef4444', Unknown: '#94a3b8',
};
const TREND_COLORS = { UP: '#22c55e', DOWN: '#ef4444', STABLE: '#f59e0b' };
const TrendIcon = ({ trend }) => {
  if (trend === 'UP') return <TrendingUp fontSize="small" />;
  if (trend === 'DOWN') return <TrendingDown fontSize="small" />;
  return <TrendingFlat fontSize="small" />;
};

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ResultCard({ result }) {
  const hc = HEALTH_COLORS[result.health_status] ?? '#94a3b8';
  const fert = result.fertilizer_recommendation;
  const mp = result.market_price;
  const tc = mp ? (TREND_COLORS[mp.trend] ?? '#64748b') : '#64748b';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Stack spacing={2.5}>
        {/* Crop ID */}
        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: alpha('#2E7D32', 0.3), bgcolor: alpha('#2E7D32', 0.03) }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <AutoAwesome sx={{ fontSize: 16, color: '#f97316' }} />
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1.5, color: 'text.secondary' }}>GEMINI AI IDENTIFICATION</Typography>
              </Stack>
              <Typography variant="h4" fontWeight={900} color="primary.main">{result.crop_name}</Typography>
              {result.variety && <Typography variant="body2" color="text.secondary">Variety: {result.variety}</Typography>}
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" fontWeight={900} color={result.confidence >= 80 ? '#22c55e' : result.confidence >= 50 ? '#f59e0b' : '#ef4444'}>
                {result.confidence}%
              </Typography>
              <Typography variant="caption" color="text.secondary">Confidence</Typography>
            </Box>
          </Stack>
          <LinearProgress variant="determinate" value={result.confidence}
            sx={{ height: 6, borderRadius: 3, bgcolor: alpha('#2E7D32', 0.12), mb: 2,
              '& .MuiLinearProgress-bar': { bgcolor: result.confidence >= 80 ? '#22c55e' : result.confidence >= 50 ? '#f59e0b' : '#ef4444', borderRadius: 3 } }} />
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.75}>
            {result.growth_stage && <Chip label={`📍 ${result.growth_stage}`} size="small" sx={{ bgcolor: alpha('#3b82f6', 0.1), color: '#1d4ed8', fontWeight: 700, height: 24 }} />}
            {result.health_status && <Chip label={result.health_status} size="small" sx={{ bgcolor: alpha(hc, 0.1), color: hc, fontWeight: 700, height: 24 }} />}
          </Stack>
          {result.observations && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.7, fontStyle: 'italic', borderLeft: '3px solid', borderColor: alpha('#2E7D32', 0.3), pl: 1.5 }}>
              {result.observations}
            </Typography>
          )}
          {result.farming_advice && (
            <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: alpha('#f97316', 0.08), border: '1px solid', borderColor: alpha('#f97316', 0.2) }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#f97316' }}>💡 Farming Tip</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{result.farming_advice}</Typography>
            </Box>
          )}
        </Paper>

        {/* Live Market Price — pinned directly below crop ID */}
        {mp ? (
          <Paper sx={{ p: 2.5, borderRadius: 4, border: '2px solid', borderColor: alpha(tc, 0.4), bgcolor: alpha(tc, 0.04) }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1.5, color: 'text.secondary' }}>CURRENT MARKET PRICE</Typography>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography variant="h3" fontWeight={900} sx={{ color: tc }}>
                    ₹{mp.price_per_quintal?.toLocaleString('en-IN')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">/quintal</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">📍 {mp.market}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end" sx={{ color: tc }}>
                  <TrendIcon trend={mp.trend} />
                  <Typography variant="h5" fontWeight={800} sx={{ color: tc }}>
                    {mp.change_percent > 0 ? '+' : ''}{mp.change_percent}%
                  </Typography>
                </Stack>
                <Chip label={mp.trend} size="small" sx={{ bgcolor: alpha(tc, 0.12), color: tc, fontWeight: 700, height: 22 }} />
              </Box>
            </Stack>
          </Paper>
        ) : (
          <Paper sx={{ p: 2, borderRadius: 4, border: '1px dashed', borderColor: alpha('#94a3b8', 0.3), textAlign: 'center', bgcolor: alpha('#94a3b8', 0.02) }}>
            <Typography variant="body2" color="text.disabled">Market price not available for this crop in our database.</Typography>
          </Paper>
        )}

        {/* Fertilizer Recommendation */}
        {fert && (
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: alpha('#22c55e', 0.25), bgcolor: alpha('#22c55e', 0.03) }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>🌱 Recommended Fertilizer</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha('#22c55e', 0.07) }}>
                  <Typography variant="caption" color="text.secondary" display="block">Fertilizer</Typography>
                  <Typography variant="body1" fontWeight={700}>{fert.name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha('#22c55e', 0.07) }}>
                  <Typography variant="caption" color="text.secondary" display="block">Dosage</Typography>
                  <Typography variant="body2" fontWeight={600}>{fert.dosage}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha('#22c55e', 0.07) }}>
                  <Typography variant="caption" color="text.secondary" display="block">Timing</Typography>
                  <Typography variant="body2" fontWeight={600}>{fert.timing}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  <strong>Why:</strong> {fert.reason}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Stack>
    </motion.div>
  );
}

export default function CustomerCropScanner() {
  usePageTitle('Crop Scanner');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f); setResult(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setResult(null);
    try {
      const base64 = await toBase64(file);
      const mimeType = file.type || 'image/jpeg';
      const { data } = await api.post('/ai/scan/', { image_base64: base64, mime_type: mimeType });
      setResult(data);
      if (data.crop_name && data.crop_name !== 'Could not identify') {
        toast.success(`Identified: ${data.crop_name} (${data.confidence}% confidence)`);
      } else {
        toast.warning('Could not confidently identify the crop. Try a clearer photo.');
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'AI scan failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const reset = () => { setFile(null); setPreview(null); setResult(null); };

  return (
    <DashboardLayout title="Crop Scanner">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>AI Crop Scanner</Typography>
          <Typography variant="body2" color="text.secondary">
            Upload a crop photo — Gemini AI identifies the crop, recommends a fertilizer, and shows the live market price.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Upload panel */}
          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <Paper onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => !file && inputRef.current?.click()}
                sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '2px dashed',
                  borderColor: preview ? 'primary.main' : alpha('#2E7D32', 0.3),
                  textAlign: 'center', cursor: file ? 'default' : 'pointer',
                  bgcolor: alpha('#2E7D32', 0.03),
                  '&:hover': !file ? { borderColor: 'primary.main', bgcolor: alpha('#2E7D32', 0.06) } : {},
                  transition: 'all 0.2s' }}>
                <input ref={inputRef} type="file" hidden accept="image/*" onChange={e => handleFile(e.target.files[0])} />
                {preview ? (
                  <Box>
                    <Box component="img" src={preview} sx={{ maxHeight: 220, maxWidth: '100%', borderRadius: 3, objectFit: 'cover', mx: 'auto' }} />
                    <Typography variant="caption" color="primary.main" display="block" fontWeight={600} sx={{ mt: 1 }}>
                      ✓ Image loaded
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <CloudUploadOutlined sx={{ fontSize: 52, color: alpha('#2E7D32', 0.4), mb: 1.5 }} />
                    <Typography variant="subtitle1" fontWeight={700}>Drop crop photo here</Typography>
                    <Typography variant="body2" color="text.secondary">or click to browse · JPG, PNG, WebP</Typography>
                  </>
                )}
              </Paper>

              {file && !scanning && !result && (
                <Button variant="contained" size="large" fullWidth onClick={handleScan}
                  startIcon={<AutoAwesome />} sx={{ py: 1.5, fontWeight: 700 }}>
                  Analyse with Gemini AI
                </Button>
              )}
              {scanning && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress sx={{ color: '#2E7D32', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">Gemini is analysing your image…</Typography>
                </Box>
              )}
              {result && (
                <Button variant="outlined" startIcon={<RestartAlt />} onClick={reset} sx={{ borderRadius: 2 }}>
                  Scan another crop
                </Button>
              )}
            </Stack>
          </Grid>

          {/* Results panel */}
          <Grid item xs={12} md={7}>
            <AnimatePresence mode="wait">
              {!file && !result && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Paper sx={{ p: 6, borderRadius: 4, border: '2px dashed', borderColor: alpha('#2E7D32', 0.15), textAlign: 'center', bgcolor: alpha('#2E7D32', 0.02) }}>
                    <Typography sx={{ fontSize: 56, mb: 2 }}>🌾</Typography>
                    <Typography variant="h6" fontWeight={700} color="text.secondary">Upload an image to begin</Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mt: 1, maxWidth: 340, mx: 'auto' }}>
                      Works best with clear, well-lit photos of leaves, fruits, or the whole plant.
                    </Typography>
                  </Paper>
                </motion.div>
              )}
              {result && !scanning && (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ResultCard result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
      </Stack>
    </DashboardLayout>
  );
}
