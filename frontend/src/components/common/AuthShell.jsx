import { Box, Typography } from '@mui/material';
import { AgricultureOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

/**
 * AuthShell – shared layout wrapper for all auth pages.
 * Renders a split screen on desktop (green branding panel + form panel)
 * and a centred card on mobile.
 *
 * Props:
 *  title    – form heading
 *  subtitle – form subheading
 *  wide     – use a wider form column (for signup)
 *  children – form content
 */
export default function AuthShell({ title, subtitle, wide = false, children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        bgcolor: 'background.default',
      }}
    >
      {/* ── Branding panel (hidden on mobile) ─────────────────────────── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: wide ? '40%' : '45%',
          flexShrink: 0,
          background: 'linear-gradient(160deg, #1b5e20 0%, #2E7D32 45%, #4caf50 100%)',
          p: { md: 5, lg: 7 },
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          },
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AgricultureOutlined sx={{ color: 'white', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ color: 'white', fontWeight: 800, lineHeight: 1.1 }}
            >
              CropX
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
              Smart agriculture
            </Typography>
          </Box>
        </Box>

        {/* Mid copy */}
        <Box>
          <Typography
            variant="h3"
            sx={{ color: 'white', mb: 2, lineHeight: 1.2 }}
          >
            The modern platform for farmers and buyers.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            Thousands of farms, hundreds of thousands of orders — all managed in one place.
          </Typography>
        </Box>

        {/* Bottom stats */}
        <Box sx={{ display: 'flex', gap: 4 }}>
          {[
            { v: '4.8K+', l: 'Active farms' },
            { v: '99.9%', l: 'Uptime' },
          ].map((s) => (
            <Box key={s.l}>
              <Typography
                variant="h5"
                sx={{ color: 'white', fontWeight: 800 }}
              >
                {s.v}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                {s.l}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Form panel ────────────────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 4, md: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: wide ? 560 : 460 }}>
          {/* Mobile logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1,
              mb: 4,
              textDecoration: 'none',
            }}
          >
            <AgricultureOutlined sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={800} color="primary.main">
              CropX
            </Typography>
          </Box>

          {title && (
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.75 }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3.5 }}>
              {subtitle}
            </Typography>
          )}

          {children}
        </Box>
      </Box>
    </Box>
  );
}
