import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

/**
 * Generic public-page wrapper with sticky Navbar.
 */
export default function PageShell({ children, maxWidth = 'lg' }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Container maxWidth={maxWidth} sx={{ py: { xs: 4, md: 6 }, flex: 1 }}>
        {children}
      </Container>
    </Box>
  );
}
