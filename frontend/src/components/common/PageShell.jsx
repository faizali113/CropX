import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

export default function PageShell({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F8FAF5 0%, #eef7eb 100%)' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {children}
      </Container>
    </Box>
  );
}
