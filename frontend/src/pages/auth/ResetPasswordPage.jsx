import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { CheckCircleOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AuthShell from '../../components/common/AuthShell';
import { parseApiError } from '../../utils/errorParser';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function ResetPasswordPage() {
  usePageTitle('Set new password');
  const [done, setDone] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/reset-password/', {
        uidb64: searchParams.get('uidb64'),
        token: searchParams.get('token'),
        new_password: data.new_password,
        new_password_confirm: data.new_password_confirm,
      });
      setDone(true);
    } catch (error) {
      toast.error(parseApiError(error, 'Unable to reset password.'));
    }
  };

  if (done) {
    return (
      <AuthShell title="Password updated!" subtitle="">
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CheckCircleOutlined sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your password has been reset successfully. You can now sign in with your new password.
          </Typography>
          <Button variant="contained" fullWidth onClick={() => navigate('/login')}>
            Go to sign in
          </Button>
        </Box>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password to secure your account."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <TextField
            label="New password"
            type="password"
            fullWidth
            autoComplete="new-password"
            {...register('new_password', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
            error={Boolean(errors.new_password)}
            helperText={errors.new_password?.message}
          />
          <TextField
            label="Confirm new password"
            type="password"
            fullWidth
            autoComplete="new-password"
            {...register('new_password_confirm', {
              required: 'Please confirm your password',
              validate: (v) => v === watch('new_password') || 'Passwords do not match',
            })}
            error={Boolean(errors.new_password_confirm)}
            helperText={errors.new_password_confirm?.message}
          />
          <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Updating…' : 'Reset password'}
          </Button>
        </Stack>
      </form>
    </AuthShell>
  );
}
