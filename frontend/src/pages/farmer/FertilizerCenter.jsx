import { Box, Paper, Stack, Typography, alpha } from '@mui/material';
import { Science } from '@mui/icons-material';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function FertilizerCenter() {
  usePageTitle('Fertilizer Center');

  return (
    <DashboardLayout title="Fertilizer Center">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Fertilizer Center</Typography>
          <Typography variant="body2" color="text.secondary">
            Smart fertilizer recommendations based on your crop and soil data.
          </Typography>
        </Box>

        {/* Honest empty state — fertilizer catalog not yet in the database */}
        <Paper
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: 4,
            border: '2px dashed',
            borderColor: alpha('#22c55e', 0.25),
            textAlign: 'center',
            bgcolor: alpha('#22c55e', 0.02),
          }}
        >
          <Science sx={{ fontSize: 64, color: alpha('#2E7D32', 0.35), mb: 2 }} />
          <Typography variant="h6" fontWeight={700} color="text.secondary">
            No fertilizer catalog yet
          </Typography>
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ mt: 1, maxWidth: 440, mx: 'auto', lineHeight: 1.7 }}
          >
            A fertilizer recommendation engine will be built here — it will use your detected
            disease, current crop stage, and soil type to suggest the correct products with
            dosage, brand, and price. Add a <strong>Fertilizer</strong> model to the backend
            to power this feature.
          </Typography>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}
