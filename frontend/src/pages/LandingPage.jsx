import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import {
  AgricultureOutlined,
  AnalyticsOutlined,
  ArrowForward,
  CheckCircleOutlined,
  Groups2Outlined,
  StorefrontOutlined,
  VerifiedOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SectionHeading from '../components/common/SectionHeading';
import { usePageTitle } from '../hooks/usePageTitle';

/* ─── Static data ─────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <AgricultureOutlined sx={{ fontSize: 32 }} />,
    title: 'Smart Farm Management',
    description:
      'Track crop health, field status, and harvest schedules from one intuitive dashboard.',
  },
  {
    icon: <StorefrontOutlined sx={{ fontSize: 32 }} />,
    title: 'Live Marketplace',
    description:
      'Connect directly with verified buyers. List produce and close deals in minutes.',
  },
  {
    icon: <AnalyticsOutlined sx={{ fontSize: 32 }} />,
    title: 'Data-Driven Insights',
    description:
      'AI-powered analytics surface the trends that matter so you can act fast.',
  },
  {
    icon: <Groups2Outlined sx={{ fontSize: 32 }} />,
    title: 'Role-Based Dashboards',
    description:
      'Tailored views for farmers, customers, and admins — no clutter, just clarity.',
  },
  {
    icon: <VerifiedOutlined sx={{ fontSize: 32 }} />,
    title: 'Verified Accounts',
    description:
      'Email-verified users and JWT authentication keep every transaction secure.',
  },
  {
    icon: <CheckCircleOutlined sx={{ fontSize: 32 }} />,
    title: '99.9 % Uptime',
    description:
      'Built on robust infrastructure so your operations are never interrupted.',
  },
];

const STATS = [
  { value: '4.8K+', label: 'Active farms' },
  { value: '92K+', label: 'Orders processed' },
  { value: '99.9%', label: 'Platform uptime' },
  { value: '3 roles', label: 'Tailored dashboards' },
];

const TESTIMONIALS = [
  {
    quote:
      'CropX cut our order processing time in half. The marketplace is intuitive and our buyers love it.',
    name: 'Amara Diallo',
    role: 'Farmer, West Africa',
    initial: 'A',
  },
  {
    quote:
      'As a wholesale customer I finally have full visibility into supply. Reordering takes seconds.',
    name: 'James Okonkwo',
    role: 'Customer, Lagos',
    initial: 'J',
  },
  {
    quote:
      'Managing a platform with hundreds of farmers used to be chaos. CropX admin tools changed that.',
    name: 'Priya Sharma',
    role: 'Platform Admin',
    initial: 'P',
  },
];

/* ─── Animation variants ──────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function LandingPage() {
  usePageTitle('Home');

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 14 },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(46,125,50,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            {/* Left copy */}
            <Grid item xs={12} md={6}>
              <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <Chip
                  label="Smart Agriculture Platform"
                  color="primary"
                  size="small"
                  sx={{ mb: 2.5, fontWeight: 700, px: 1 }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.4rem', sm: '3rem', md: '3.6rem' },
                    mb: 2.5,
                    lineHeight: 1.07,
                  }}
                >
                  Grow smarter{' '}
                  <Box component="span" sx={{ color: 'primary.main' }}>
                    with CropX.
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 4, maxWidth: 520, fontWeight: 400, lineHeight: 1.7 }}
                >
                  Connect farmers, customers, and intelligent tools in one premium
                  agricultural marketplace built for modern growth.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                  >
                    Get started free
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="large"
                    color="primary"
                  >
                    Sign in
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            {/* Right card */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <Paper
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    PLATFORM HIGHLIGHTS
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      'AI-powered disease detection',
                      'Real-time harvest marketplace',
                      'Verified farmer & buyer profiles',
                      'Role-based dashboards',
                      'Secure JWT authentication',
                    ].map((item) => (
                      <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2" fontWeight={500}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  {/* Mini stats row */}
                  <Grid container spacing={1.5} sx={{ mt: 3 }}>
                    {STATS.slice(0, 2).map((s) => (
                      <Grid item xs={6} key={s.label}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            bgcolor: alpha('#2E7D32', 0.06),
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h5" fontWeight={800} color="primary.main">
                            {s.value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {s.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <Box sx={{ borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {STATS.map((s, i) => (
              <Grid item xs={6} md={3} key={s.label}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                >
                  <Box sx={{ textAlign: 'center', py: 1 }}>
                    <Typography variant="h4" fontWeight={800} color="primary.main">
                      {s.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {s.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Features grid ────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow="Platform capabilities"
            title="Built for the full farm-to-market journey"
            subtitle="Every touchpoint is designed to feel premium, intuitive, and efficient."
            align="center"
          />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {FEATURES.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  custom={i}
                  variants={fadeUp}
                  style={{ height: '100%' }}
                >
                  <Paper
                    sx={{
                      p: 3.5,
                      height: '100%',
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(46,125,50,0.12)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        bgcolor: alpha('#2E7D32', 0.08),
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                      {f.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: alpha('#2E7D32', 0.03) }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by farmers and buyers"
            subtitle="Hear from the people who use CropX every day."
            align="center"
          />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {TESTIMONIALS.map((t, i) => (
              <Grid item xs={12} md={4} key={t.name}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  custom={i}
                  variants={fadeUp}
                >
                  <Paper
                    sx={{
                      p: 3.5,
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: 'divider',
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3, lineHeight: 1.7, fontStyle: 'italic' }}
                    >
                      "{t.quote}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      >
                        {t.initial}
                      </Box>
                      <Box>
                        <Typography fontWeight={700} variant="body2">
                          {t.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t.role}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA banner ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #1b5e20 0%, #2E7D32 50%, #4caf50 100%)',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h3" color="white" sx={{ mb: 2 }}>
              Ready to grow with CropX?
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}
            >
              Join thousands of farmers and buyers building the future of agriculture.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)', transform: 'translateY(-1px)' },
                }}
                endIcon={<ArrowForward />}
              >
                Create free account
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' } }}
              >
                Sign in
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Box
        component="footer"
        sx={{
          py: 4,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} CropX. Smart agriculture for everyone.
        </Typography>
      </Box>
    </Box>
  );
}
