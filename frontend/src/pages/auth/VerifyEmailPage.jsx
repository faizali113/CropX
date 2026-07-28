import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function VerifyEmailPage() {
  const { uidb64, token } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${uidb64}/${token}/`);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    };

    verify();
  }, [uidb64, token]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F8FAF5 0%, #eef7eb 100%)', p: 3 }}>
      <Container maxWidth="sm">
        <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e8f5e9' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h4" fontWeight={800} color="#2E7D32" sx={{ mb: 1 }}>Email verification</Typography>
            {status === 'loading' && <Typography color="text.secondary">Verifying your email address...</Typography>}
            {status === 'success' && <Typography color="text.secondary">Your email has been verified successfully. You can now sign in.</Typography>}
            {status === 'error' && <Typography color="text.secondary">The verification link is invalid or expired.</Typography>}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
