import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { CheckCircleOutlined, ErrorOutlined } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import AuthShell from '../../components/common/AuthShell';
import { usePageTitle } from '../../hooks/usePageTitle';

const STATES = { loading: 'loading', success: 'success', error: 'error' };

export default function VerifyEmailPage() {
  usePageTitle('Verify email');
  const { uidb64, token } = useParams();
  const [status, setStatus] = useState(STATES.loading);

  useEffect(() => {
    api
      .get(`/auth/verify-email/${uidb64}/${token}/`)
      .then(() => setStatus(STATES.success))
      .catch(() => setStatus(STATES.error));
  }, [uidb64, token]);

  const content = {
    [STATES.loading]: {
      icon: <CircularProgress size={48} sx={{ color: 'primary.main' }} />,
      title: 'Verifying your email…',
      body: 'Please wait while we verify your email address.',
      cta: null,
    },
    [STATES.success]: {
      icon: <CheckCircleOutlined sx={{ fontSize: 56, color: 'primary.main' }} />,
      title: 'Email verified!',
      body: 'Your email has been verified successfully. You can now sign in to CropX.',
      cta: (
        <Button component={Link} to="/login" variant="contained" fullWidth>
          Go to sign in
        </Button>
      ),
    },
    [STATES.error]: {
      icon: <ErrorOutlined sx={{ fontSize: 56, color: 'error.main' }} />,
      title: 'Verification failed',
      body: 'The verification link is invalid or has expired. Please request a new one.',
      cta: (
        <Button component={Link} to="/signup" variant="outlined" fullWidth>
          Back to sign up
        </Button>
      ),
    },
  }[status];

  return (
    <AuthShell title="" subtitle="">
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Box sx={{ mb: 2.5 }}>{content.icon}</Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>
          {content.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {content.body}
        </Typography>
        {content.cta}
      </Box>
    </AuthShell>
  );
}
