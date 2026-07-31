import { Box, Stack, Typography } from '@mui/material';

/**
 * Reusable section heading with optional eyebrow, title, and subtitle.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
}) {
  return (
    <Stack spacing={1} sx={{ mb: 4, textAlign: align, alignItems: align === 'center' ? 'center' : 'flex-start' }}>
      {eyebrow && (
        <Typography
          variant="overline"
          color="primary"
          sx={{ fontWeight: 800, letterSpacing: 1.5 }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography variant="h4" fontWeight={800} color="text.primary">
        {title}
      </Typography>
      {subtitle && (
        <Typography
          color="text.secondary"
          sx={{ maxWidth: align === 'center' ? 560 : 'none', lineHeight: 1.7 }}
        >
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
}
