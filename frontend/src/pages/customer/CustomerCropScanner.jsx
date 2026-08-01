import { useRef, useState } from 'react';
import { Box, Button, Paper, Stack, Typography, alpha, CircularProgress } from '@mui/material';
import { CloudUploadOutlined, BugReport } from '@mui/icons-material';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';

/**
 * CustomerCropScanner — Step 3 shell.
 * The AI crop identification + market price logic will be wired in Step 4.
 */
export default function CustomerCropScanner() {
  usePageTitle('Crop Scanner');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <DashboardLayout title="Crop Scanner">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Crop Scanner</Typography>
          <Typography variant="body2" color="text.secondary">
            Upload a crop photo to identify it and get the current market price.
          </Typography>
        </Box>

        <Paper
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          sx={{
            p: { xs: 4, md: 6 }, borderRadius: 4,
            border: '2px dashed', borderColor: preview ? 'primary.main' : alpha('#2E7D32', 0.3),
            textAlign: 'center', cursor: 'pointer',
            bgcolor: alpha('#2E7D32', 0.03),
            '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#2E7D32', 0.06) },
            transition: 'all 0.2s',
          }}
        >
          <input ref={inputRef} type="file" hidden accept="image/*" onChange={e => handleFile(e.target.files[0])} />
          {preview ? (
            <Box>
              <Box component="img" src={preview} sx={{ maxHeight: 240, maxWidth: '100%', borderRadius: 3, objectFit: 'cover', mx: 'auto' }} />
              <Typography variant="caption" color="primary.main" display="block" fontWeight={600} sx={{ mt: 1 }}>
                ✓ Image ready — AI analysis will be wired in Step 4
              </Typography>
            </Box>
          ) : (
            <>
              <CloudUploadOutlined sx={{ fontSize: 56, color: alpha('#2E7D32', 0.4), mb: 1.5 }} />
              <Typography variant="subtitle1" fontWeight={700}>Drop your crop photo here</Typography>
              <Typography variant="body2" color="text.secondary">or click to browse · JPG, PNG, WebP</Typography>
            </>
          )}
        </Paper>

        {file && (
          <Paper sx={{ p: 3, borderRadius: 4, border: '2px dashed', borderColor: alpha('#f97316', 0.3), bgcolor: alpha('#f97316', 0.03), textAlign: 'center' }}>
            <BugReport sx={{ fontSize: 40, color: alpha('#f97316', 0.4), mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={700} color="text.secondary">AI Analysis Coming in Step 4</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5, maxWidth: 400, mx: 'auto' }}>
              In Step 4, this scanner will use Gemini/OpenAI to identify the crop from the image,
              suggest the appropriate fertilizer, and display the live market price directly below.
            </Typography>
          </Paper>
        )}
      </Stack>
    </DashboardLayout>
  );
}
