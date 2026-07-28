import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/reset-password/', {
        uidb64: searchParams.get('uidb64'),
        token: searchParams.get('token'),
        new_password: data.new_password,
        new_password_confirm: data.new_password_confirm,
      });
      toast.success('Password reset successful');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Unable to reset password');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F8FAF5 0%, #eef7eb 100%)', p: 3 }}>
      <Container maxWidth="sm">
        <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e8f5e9' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography variant="h4" fontWeight={800} color="#2E7D32" sx={{ mb: 1 }}>Set a new password</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Choose a strong password to secure your account.</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2.5}>
                <TextField label="New Password" type="password" fullWidth {...register('new_password', { required: 'New password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })} error={Boolean(errors.new_password)} helperText={errors.new_password?.message} />
                <TextField label="Confirm Password" type="password" fullWidth {...register('new_password_confirm', { required: 'Confirm password is required', validate: (value) => value === watch('new_password') || 'Passwords do not match' })} error={Boolean(errors.new_password_confirm)} helperText={errors.new_password_confirm?.message} />
                <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#256b28' } }}>
                  {isSubmitting ? 'Updating...' : 'Reset Password'}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
