import { Stack, Typography } from '@mui/material';

export default function SectionHeading({ eyebrow, title, subtitle, align = 'left' }) {
  return (
    <Stack spacing={1} sx={{ mb: 3, textAlign: align }}>
      {eyebrow ? <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>{eyebrow}</Typography> : null}
      <Typography variant="h4" fontWeight={800} color="#1E293B">{title}</Typography>
      {subtitle ? <Typography color="text.secondary">{subtitle}</Typography> : null}
    </Stack>
  );
}
