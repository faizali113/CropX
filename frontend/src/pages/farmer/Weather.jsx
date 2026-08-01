import { Box, Button, Paper, Stack, Typography, alpha } from '@mui/material';
import { WbSunnyOutlined } from '@mui/icons-material';
import DashboardLayout from '../../components/common/DashboardLayout';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function Weather() {
  usePageTitle('Weather');

  return (
    <DashboardLayout title="Weather">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Weather Forecast</Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time agricultural weather data for your farm location.
          </Typography>
        </Box>

        {/* Honest empty state — no weather API is connected yet */}
        <Paper
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: 4,
            border: '2px dashed',
            borderColor: alpha('#3b82f6', 0.25),
            textAlign: 'center',
            bgcolor: alpha('#3b82f6', 0.02),
          }}
        >
          <WbSunnyOutlined sx={{ fontSize: 64, color: alpha('#f59e0b', 0.5), mb: 2 }} />
          <Typography variant="h6" fontWeight={700} color="text.secondary">
            Weather API not connected
          </Typography>
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ mt: 1, mb: 3, maxWidth: 440, mx: 'auto', lineHeight: 1.7 }}
          >
            Connect a weather API (e.g. OpenWeatherMap, WeatherAPI.com) to display real-time
            forecasts, temperature, rain probability, and AI-powered farming advice based on
            your farm's GPS coordinates.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
            <Button
              variant="outlined"
              size="small"
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderRadius: 2 }}
            >
              OpenWeatherMap API →
            </Button>
            <Button
              variant="outlined"
              size="small"
              href="https://www.weatherapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderRadius: 2 }}
            >
              WeatherAPI.com →
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </DashboardLayout>
  );
}
