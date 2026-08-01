import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import {
  AgricultureOutlined, AnalyticsOutlined, ArrowForward, BugReportOutlined,
  CheckCircleOutlined, Groups2Outlined, LockOutlined,
  ShoppingCartOutlined, StorefrontOutlined, TrendingUpOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/common/LandingNavbar';
import { usePageTitle } from '../hooks/usePageTitle';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FEATURES = [
  { icon: <AgricultureOutlined sx={{ fontSize: 28 }} />, title: 'Farm Management', description: 'Manage multiple farms, track soil health, irrigation, and crop lifecycle from one dashboard.', color: '#2E7D32' },
  { icon: <StorefrontOutlined sx={{ fontSize: 28 }} />, title: 'Live Marketplace', description: 'List your produce and connect with verified buyers. Close deals in real time.', color: '#0284c7' },
  { icon: <BugReportOutlined sx={{ fontSize: 28 }} />, title: 'AI Disease Scanner', description: 'Upload a leaf photo. Get instant disease identification, severity level, and treatment plan.', color: '#dc2626' },
  { icon: <TrendingUpOutlined sx={{ fontSize: 28 }} />, title: 'Market Prices', description: 'Live mandi prices across India. Know the best time to sell any crop.', color: '#d97706' },
  { icon: <AnalyticsOutlined sx={{ fontSize: 28 }} />, title: 'Crop Analytics', description: 'Track yield history, revenue trends, and water usage with clear visual charts.', color: '#7c3aed' },
  { icon: <LockOutlined sx={{ fontSize: 28 }} />, title: 'Secure & Verified', description: 'JWT authentication, email verification, and role-based access control on every request.', color: '#0891b2' },
];

const HOW_IT_WORKS = [
  { step: '01', role: 'Farmer', title: 'Create your farm profile', body: 'Register, verify your email, and add your farm. List crops with photos, quantity, and price.' },
  { step: '02', role: 'Customer', title: 'Browse & scan crops', body: 'Explore listings, upload a crop photo to identify and get market price, then place an order.' },
  { step: '03', role: 'Both', title: 'Negotiate & confirm', body: 'Chat directly with the farmer. Once the farmer confirms, the deal status updates instantly.' },
];

const STATS = [
  { value: '4.8K+', label: 'Active farms' },
  { value: '92K+', label: 'Orders placed' },
  { value: '3', label: 'Tailored dashboards' },
  { value: '99.9%', label: 'Platform uptime' },
];

export default function LandingPage() {
  usePageTitle('Home');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', overflowX: 'hidden' }}>
      <LandingNavbar />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 10, md: 16 },
          pb: { xs: 10, md: 18 },
          overflow: 'hidden',
        }}
      >
        {/* Background blobs */}
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <Box sx={{
            position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
            width: '120vw', height: '80vh',
            background: isDark
              ? 'radial-gradient(ellipse at 50% 0%, rgba(46,125,50,0.18) 0%, transparent 65%)'
              : 'radial-gradient(ellipse at 50% 0%, rgba(46,125,50,0.10) 0%, transparent 65%)',
          }} />
          <Box sx={{
            position: 'absolute', bottom: '-10%', right: '-10%',
            width: 500, height: 500, borderRadius: '50%',
            background: isDark ? 'rgba(76,175,80,0.04)' : 'rgba(76,175,80,0.06)',
            filter: 'blur(80px)',
          }} />
          <Box sx={{
            position: 'absolute', top: '30%', left: '-5%',
            width: 300, height: 300, borderRadius: '50%',
            background: isDark ? 'rgba(46,125,50,0.06)' : 'rgba(46,125,50,0.08)',
            filter: 'blur(60px)',
          }} />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">

            {/* Left — Headline */}
            <Grid item xs={12} md={6}>
              <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <Chip
                  label="🌱 AgriTech Platform"
                  size="small"
                  sx={{
                    mb: 3, fontWeight: 700, fontSize: '0.75rem', px: 1,
                    bgcolor: alpha('#2E7D32', isDark ? 0.2 : 0.08),
                    color: isDark ? '#86efac' : '#15803d',
                    border: `1px solid ${alpha('#2E7D32', 0.2)}`,
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.6rem', sm: '3.2rem', md: '4rem', lg: '4.5rem' },
                    fontWeight: 900, lineHeight: 1.05, mb: 3,
                    letterSpacing: '-0.03em',
                  }}
                >
                  The smarter way{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg,#2E7D32 0%,#4caf50 50%,#81c784 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}
                  >
                    to grow & sell
                  </Box>
                  {' '}crops.
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mb: 4.5, maxWidth: 500, fontWeight: 400, lineHeight: 1.75, fontSize: '1.05rem' }}
                >
                  CropX connects farmers and customers on one intelligent platform — from
                  listing crops to AI-powered disease detection, live market prices, and
                  real-time deal management.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      px: 4, py: 1.75, fontSize: '1rem', fontWeight: 700,
                      background: 'linear-gradient(135deg,#2E7D32,#4caf50)',
                      boxShadow: '0 8px 24px rgba(46,125,50,0.4)',
                      '&:hover': { boxShadow: '0 12px 32px rgba(46,125,50,0.5)', transform: 'translateY(-2px)' },
                    }}
                  >
                    Get started free
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="large"
                    sx={{ px: 4, py: 1.75, fontSize: '1rem', fontWeight: 600, borderWidth: 1.5, '&:hover': { borderWidth: 1.5 } }}
                  >
                    Sign in
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            {/* Right — Feature card */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Paper
                  sx={{
                    p: { xs: 3, md: 4 }, borderRadius: 5,
                    border: '1px solid', borderColor: 'divider',
                    bgcolor: isDark ? alpha('#152015', 0.9) : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: isDark
                      ? '0 32px 64px rgba(0,0,0,0.4)'
                      : '0 32px 64px rgba(46,125,50,0.12)',
                  }}
                >
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 2 }}>
                    Platform at a glance
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    {[
                      { icon: '🌾', label: 'Farmer Dashboard', desc: 'Manage farms, crops, orders & market listings' },
                      { icon: '🛒', label: 'Customer Portal', desc: 'Browse, scan, order, and track deliveries' },
                      { icon: '🔬', label: 'AI Disease Scanner', desc: 'Upload a leaf photo — get instant diagnosis' },
                      { icon: '📊', label: 'Live Crop Prices', desc: 'Real-time mandi data from across India' },
                      { icon: '💬', label: 'Direct Messaging', desc: 'Negotiate deals with farmers in real time' },
                    ].map(item => (
                      <Box
                        key={item.label}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 2,
                          p: 1.5, borderRadius: 3,
                          bgcolor: alpha('#2E7D32', isDark ? 0.08 : 0.04),
                          transition: 'all 0.15s',
                          '&:hover': { bgcolor: alpha('#2E7D32', isDark ? 0.14 : 0.08) },
                        }}
                      >
                        <Typography sx={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>{item.icon}</Typography>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{item.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                        </Box>
                        <CheckCircleOutlined sx={{ ml: 'auto', fontSize: 18, color: 'primary.main', flexShrink: 0 }} />
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          py: 4,
          borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider',
          bgcolor: isDark ? alpha('#152015', 0.6) : alpha('#ffffff', 0.7),
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {STATS.map((s, i) => (
              <Grid item xs={6} sm={3} key={s.label}>
                <motion.div
                  initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h4" fontWeight={900}
                      sx={{
                        background: 'linear-gradient(135deg,#2E7D32,#4caf50)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                      }}
                    >
                      {s.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>{s.label}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
                How it works
              </Typography>
              <Typography variant="h3" fontWeight={800} sx={{ mt: 1, mb: 1.5 }}>
                Three simple steps
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
                From registration to confirmed deal in minutes.
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {HOW_IT_WORKS.map((step, i) => (
              <Grid item xs={12} md={4} key={step.step}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} custom={i} variants={fadeUp}>
                  <Box sx={{ position: 'relative', pl: { md: 0 } }}>
                    {/* Step number */}
                    <Typography
                      sx={{
                        fontSize: '5rem', fontWeight: 900, lineHeight: 1,
                        color: alpha('#2E7D32', isDark ? 0.15 : 0.08),
                        mb: -1.5, userSelect: 'none',
                      }}
                    >
                      {step.step}
                    </Typography>
                    <Paper
                      sx={{
                        p: 3.5, borderRadius: 4,
                        border: '1px solid', borderColor: 'divider',
                        '&:hover': { boxShadow: '0 16px 48px rgba(46,125,50,0.12)', transform: 'translateY(-4px)' },
                        transition: 'all 0.25s ease',
                      }}
                    >
                      <Chip
                        label={step.role}
                        size="small"
                        sx={{
                          mb: 2, fontWeight: 700, fontSize: '0.7rem',
                          bgcolor: alpha('#2E7D32', isDark ? 0.2 : 0.08),
                          color: isDark ? '#86efac' : '#15803d',
                        }}
                      />
                      <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>{step.title}</Typography>
                      <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{step.body}</Typography>
                    </Paper>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURES GRID
      ═══════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          bgcolor: isDark ? alpha('#152015', 0.4) : alpha('#f0fdf4', 0.5),
        }}
      >
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
                Platform capabilities
              </Typography>
              <Typography variant="h3" fontWeight={800} sx={{ mt: 1, mb: 1.5 }}>
                Everything in one place
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 520, mx: 'auto', lineHeight: 1.7 }}>
                Built for the full farm-to-market journey.
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={3}>
            {FEATURES.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <motion.div
                  initial="hidden" whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  custom={i} variants={fadeUp}
                  style={{ height: '100%' }}
                >
                  <Paper
                    sx={{
                      p: 3.5, height: '100%', borderRadius: 4,
                      border: '1px solid', borderColor: 'divider',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: `0 16px 48px ${alpha(f.color, 0.15)}`,
                        borderColor: alpha(f.color, 0.35),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56, height: 56, borderRadius: 3,
                        bgcolor: alpha(f.color, isDark ? 0.15 : 0.1),
                        color: f.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mb: 2.5,
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.75}>{f.description}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          DUAL CTA — FARMER vs CUSTOMER
      ═══════════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" fontWeight={800} sx={{ mb: 1.5 }}>
                Who is CropX for?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                Purpose-built dashboards for every role.
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {/* Farmer card */}
            <Grid item xs={12} md={6}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
                <Paper
                  sx={{
                    p: { xs: 4, md: 5 }, borderRadius: 5, height: '100%',
                    background: isDark
                      ? 'linear-gradient(145deg,#0d1b0e,#1a2e1a)'
                      : 'linear-gradient(145deg,#f0fdf4,#dcfce7)',
                    border: '1px solid', borderColor: alpha('#2E7D32', 0.2),
                    boxShadow: `0 24px 64px ${alpha('#2E7D32', 0.12)}`,
                  }}
                >
                  <Typography sx={{ fontSize: 52, mb: 2, lineHeight: 1 }}>🧑‍🌾</Typography>
                  <Chip label="Farmer" size="small" sx={{ mb: 2, bgcolor: alpha('#2E7D32', 0.15), color: '#15803d', fontWeight: 700 }} />
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 1.5 }}>
                    Grow your farm business
                  </Typography>
                  <Stack spacing={1} sx={{ mb: 3.5 }}>
                    {['Manage unlimited farms & crops', 'List produce on the marketplace', 'AI disease detection from your phone', 'Track orders, revenue & deliveries', 'Chat directly with buyers'].map(t => (
                      <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2E7D32', flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary">{t}</Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    component={Link} to="/signup"
                    variant="contained" size="large" fullWidth endIcon={<ArrowForward />}
                    sx={{ py: 1.5, fontWeight: 700, background: 'linear-gradient(135deg,#2E7D32,#4caf50)', boxShadow: '0 8px 24px rgba(46,125,50,0.4)' }}
                  >
                    Join as Farmer
                  </Button>
                </Paper>
              </motion.div>
            </Grid>

            {/* Customer card */}
            <Grid item xs={12} md={6}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
                <Paper
                  sx={{
                    p: { xs: 4, md: 5 }, borderRadius: 5, height: '100%',
                    background: isDark
                      ? 'linear-gradient(145deg,#0c1a2e,#0f2040)'
                      : 'linear-gradient(145deg,#eff6ff,#dbeafe)',
                    border: '1px solid', borderColor: alpha('#1d4ed8', 0.2),
                    boxShadow: `0 24px 64px ${alpha('#1d4ed8', 0.10)}`,
                  }}
                >
                  <Typography sx={{ fontSize: 52, mb: 2, lineHeight: 1 }}>🛒</Typography>
                  <Chip label="Customer" size="small" sx={{ mb: 2, bgcolor: alpha('#1d4ed8', 0.12), color: '#1d4ed8', fontWeight: 700 }} />
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 1.5 }}>
                    Source the freshest produce
                  </Typography>
                  <Stack spacing={1} sx={{ mb: 3.5 }}>
                    {['Browse verified farm listings', 'Scan a crop photo for instant ID', 'See live market prices before buying', 'Place orders & track deliveries', 'Message farmers directly'].map(t => (
                      <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#1d4ed8', flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary">{t}</Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    component={Link} to="/signup"
                    variant="contained" size="large" fullWidth endIcon={<ArrowForward />}
                    sx={{ py: 1.5, fontWeight: 700, bgcolor: '#1d4ed8', '&:hover': { bgcolor: '#1e40af', transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(29,78,216,0.4)' } }}
                  >
                    Join as Customer
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA BANNER
      ═══════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          py: { xs: 10, md: 16 },
          background: isDark
            ? 'linear-gradient(135deg,#0d2b0e 0%,#1b5e20 50%,#1a3a1a 100%)'
            : 'linear-gradient(135deg,#1b5e20 0%,#2E7D32 50%,#388e3c 100%)',
          position: 'relative', overflow: 'hidden', textAlign: 'center',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <Box sx={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '150%', height: '150%', background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)' }} />
        </Box>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
            <Typography variant="h2" sx={{ color: 'white', mb: 2.5, fontWeight: 900 }}>
              Ready to grow with CropX?
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.75)', mb: 5, fontWeight: 400, maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
              Join thousands of farmers and buyers building the future of agriculture together.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center">
              <Button
                component={Link} to="/signup"
                variant="contained" size="large" endIcon={<ArrowForward />}
                sx={{ px: 5, py: 1.75, fontWeight: 800, fontSize: '1rem', bgcolor: 'white', color: '#2E7D32', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.92)', transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' } }}
              >
                Create free account
              </Button>
              <Button
                component={Link} to="/login"
                variant="outlined" size="large"
                sx={{ px: 5, py: 1.75, fontWeight: 700, fontSize: '1rem', borderColor: 'rgba(255,255,255,0.5)', borderWidth: 1.5, color: 'white', '&:hover': { borderColor: 'white', borderWidth: 1.5, bgcolor: 'rgba(255,255,255,0.08)' } }}
              >
                Sign in
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <Box
        component="footer"
        sx={{
          py: 4, borderTop: '1px solid', borderColor: 'divider',
          bgcolor: isDark ? '#0d1b0e' : 'white',
        }}
      >
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, background: 'linear-gradient(135deg,#2E7D32,#4caf50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AgricultureOutlined sx={{ color: 'white', fontSize: 16 }} />
              </Box>
              <Typography variant="body2" fontWeight={700} color="text.secondary">
                CropX — Smart Agriculture Platform
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.disabled">
              © {new Date().getFullYear()} CropX. All rights reserved.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
