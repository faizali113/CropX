import { Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageShell from '../components/common/PageShell';
import SectionHeading from '../components/common/SectionHeading';

const features = [
  'AI Disease Detection',
  'Smart Harvest Marketplace',
  'Role-based Dashboards',
  'Real-time Farmer Support',
];

const stats = [
  { label: 'Active farms', value: '4.8K+' },
  { label: 'Orders processed', value: '92K+' },
  { label: 'Uptime', value: '99.9%' },
];

export default function LandingPage() {
  return (
    <PageShell>
      <Stack spacing={{ xs: 4, md: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <Chip label="Smart Agriculture Platform" sx={{ bgcolor: '#e8f5e9', color: '#2E7D32', fontWeight: 700, mb: 2 }} />
              <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.08, mb: 2, fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
                Grow smarter with CropX.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 650 }}>
                Connect farmers, customers, and intelligent tools in one premium agricultural marketplace built for modern growth.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component={Link} to="/signup" variant="contained" size="large" sx={{ bgcolor: '#2E7D32', px: 3, '&:hover': { bgcolor: '#256b28' } }}>
                  Start Free
                </Button>
                <Button component={Link} to="/login" variant="outlined" size="large" sx={{ borderColor: '#2E7D32', color: '#2E7D32', px: 3 }}>
                  Explore Platform
                </Button>
              </Stack>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }}>
              <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4, background: 'rgba(255,255,255,0.92)', border: '1px solid #e8f5e9' }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>What CropX delivers</Typography>
                <Stack spacing={1.5}>
                  {features.map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FFC107' }} />
                      <Typography>{item}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e8f5e9' }}>
                <Typography variant="h5" fontWeight={800} color="#2E7D32">{stat.value}</Typography>
                <Typography color="text.secondary">{stat.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box>
          <SectionHeading eyebrow="Platform capabilities" title="Built for the full farm-to-market journey" subtitle="Every touchpoint is designed to feel premium, intuitive, and efficient." />
          <Grid container spacing={3}>
            {['Marketplace', 'Analytics', 'AI Insights'].map((title) => (
              <Grid item xs={12} md={4} key={title}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'white', border: '1px solid #eef7eb', height: '100%' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>{title}</Typography>
                  <Typography color="text.secondary">Premium agricultural workflows designed for modern farmers and buyers.</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </PageShell>
  );
}
