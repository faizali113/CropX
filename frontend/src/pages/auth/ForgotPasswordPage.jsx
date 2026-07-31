import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { MarkEmailReadOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AuthShell from '../../components/common/AuthShell';
import { parseApiError } from '../../utils/errorParser';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function ForgotPasswordPage() {
  usePageTitle('Reset password');
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/forgot-password/', data);
      setSent(true);
    } catch (error) {
      toast.error(parseApiError(error, 'Unable to process your request.'));
    }
  };

  if (sent) {
    return (
      <AuthShell title="Check your inbox" subtitle="">
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <MarkEmailReadOutlined sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            If that email exists in our system, a reset link is on its way. Check your inbox and
            spam folder.
          </Typography>
          <Button component={Link} to="/login" variant="contained" fullWidth>
            Back to sign in
          </Button>
        </Box>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <TextField
            label="Email address"
            type="email"
            fullWidth
            autoComplete="email"
            {...register('email', { required: 'Email is required' })}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
          <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </Button>
        </Stack>
      </form>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography
          component={Link}
          to="/login"
          variant="body2"
          sx={{ color: 'primary.main', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
        >
          ← Back to sign in
        </Typography>
      </Box>
    </AuthShell>
  );
}
